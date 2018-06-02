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
    browser.storage.onChanged.addListener((_changes: StorageChangeEvent<State>, areaName) => {
      if (areaName === "local") {
        this.fetchStateAndNotify(this.listeners);
      }
    });
  }

  private fetchStateAndNotify(listeners: StateChangeListener[]) {
    browser.storage.local.get<State>(null)
      .then(state => {
        listeners.forEach(l => l(state));
      });
  }

  public addChangeListener = (listener: StateChangeListener) => {
    this.listeners.push(listener);
    this.fetchStateAndNotify([ listener ]);
  }

  public transitionState = (updater: (state: State) => State) => {
    return browser.storage.local.get<State>(null)
      .then(state => {
        return browser.storage.local.set<State>(updater(state));
      });
  }
}
