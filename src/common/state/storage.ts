import { State } from "./latest";

export type StateChangeListener = (state: State) => void;

export interface StorageEngine {
  addChangeListener: (listener: StateChangeListener) => void;
  transitionState: (updater: (state: State) => State) => void;
}

// TODO: In the future, this can change to store its own copy and mirror it to/from the storage.
// TODO: Since storage is async, calling transitionState twice in a row before the first one has
// will result in an undefined state.
export class BrowserStorageEngine implements StorageEngine {
  private listeners: StateChangeListener[] = [];

  constructor() {
    browser.storage.onChanged.addListener((_changes, areaName) => {
      if (areaName === "local") {
        this.fetchStateAndNotify(this.listeners);
      }
    });
  }

  private async fetchStateAndNotify(listeners: StateChangeListener[]) {
    const state = await browser.storage.local.get(null) as State;
    listeners.forEach(l => l(state));
  }

  public addChangeListener = (listener: StateChangeListener) => {
    this.listeners.push(listener);
    this.fetchStateAndNotify([ listener ]);
  }

  public transitionState = async (updater: (state: State) => State) => {
    const state = await browser.storage.local.get(null) as State;
    return browser.storage.local.set(updater(state));
  }
}
