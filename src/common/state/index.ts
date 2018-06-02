import { once } from "lodash-es";

import { updateStateToLatest } from "./update";
import { State } from "./latest";

export * from "./latest";
export { StateService } from "./service";

let stateListeners: ((state: State) => void)[] = [];

const maybeAttachSharedStateListener = once(() => {
  browser.storage.onChanged.addListener((_changes: StorageChangeEvent<State>, areaName) => {
    if (areaName === 'local') {
      fetchStateAndNotify(stateListeners);
    }
  });
});

export function updateStateShapeIfNecessary() {
  return browser.storage.local.get<any>(null)
    .then(updateStateToLatest)
    .then(updatedState => {
      return browser.storage.local.set(updatedState);
    });
}

export function onStoredStateChange(listener: (state: State) => void) {
  maybeAttachSharedStateListener();
  stateListeners.push(listener);
  fetchStateAndNotify([ listener ]);
}

function fetchStateAndNotify(listeners: ((state: State) => void)[]) {
  return browser.storage.local.get<State>(null)
    .then(state => {
      listeners.forEach(l => l(state));
    });
}
