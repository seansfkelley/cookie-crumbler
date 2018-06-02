import '../common/init';

import { getStorageEngine, State } from "../common/state";
import { deleteCookies } from "../common/deletion";

async function initialize() {
  const engine = await getStorageEngine();

  let state: State | undefined;
  let cleanTimeoutId: number | undefined;

  engine.addChangeListener(newState => {
    state = newState;

    if (!state.settings.enableAutomaticDeletion) {
      window.clearTimeout(cleanTimeoutId);
    }
  });

  browser.tabs.onUpdated.addListener((_tabId, _info, tab) => {
    if (!state) {
      throw new Error("programmer error: state should have been side-effect initialized but wasn't");
    } else if (tab.status === "complete") {
      // Count cookies and display them in the badge.
    }
  });

  browser.tabs.onRemoved.addListener(() => {
    if (!state) {
      throw new Error("programmer error: state should have been side-effect initialized but wasn't");
    } else if (state.settings.enableAutomaticDeletion && cleanTimeoutId == null) {
      // Refer to window specifically because we're pulling in types for Node's globals, which are different...
      cleanTimeoutId = window.setTimeout(() => {
        window.clearTimeout(cleanTimeoutId);
        deleteCookies(state!.rules);
      }, state.settings.automaticDeletionDelayMillis);
    }
  });
}

initialize();
