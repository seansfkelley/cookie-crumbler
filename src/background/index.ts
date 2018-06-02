import '../common/init';

import { getStorageEngine, StorageEngine, State } from "../common/state";
import { deleteCookies } from "../common/deletion";

function initialize(engine: StorageEngine) {
  let state: State;
  let cleanTimeoutId: number | undefined;

  engine.addChangeListener(newState => {
    state = newState;

    if (!state.settings.enableAutomaticDeletion) {
      window.clearTimeout(cleanTimeoutId);
    }
  });

  if (state! == null) {
    throw new Error("programmer error: state should have been side-effect initialized but wasn't");
  }

  browser.tabs.onUpdated.addListener((_tabId, _info, tab) => {
    if (tab.status === "complete") {
      // Count cookies and display them in the badge.
    }
  });

  browser.tabs.onRemoved.addListener(() => {
    if (state.settings.enableAutomaticDeletion && cleanTimeoutId == null) {
      // Refer to window specifically because we're pulling in types for Node's globals, which are different...
      cleanTimeoutId = window.setTimeout(() => {
        window.clearTimeout(cleanTimeoutId);
        deleteCookies(state.rules);
      }, state.settings.automaticDeletionDelayMillis);
    }
  });
}

getStorageEngine().then(initialize);
