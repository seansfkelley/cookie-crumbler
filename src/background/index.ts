import { values, sum } from "lodash-es";

import '../common/init';

import { getStorageEngine, State, StateService } from "../common/state";
import { deleteCookies } from "../common/deletion";

async function initialize() {
  const engine = await getStorageEngine();
  const service = new StateService(engine.transitionState);

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
      // TODO: Also use alarms, because browsers will unload the extension after a certain amount of time...
      cleanTimeoutId = window.setTimeout(async () => {
        window.clearTimeout(cleanTimeoutId);
        const log = await deleteCookies(state!.rules);
        service.addLogBatch(log);

        const totalCount = sum(values(log.deletions));

        if (state!.settings.enableNotifications && totalCount > 0) {
          const domains = Object.keys(log.deletions).sort();
          const message = (function() {
            if (domains.length === 1) {
              return browser.i18n.getMessage("from_ZsiteoneZ", domains);
            } else if (domains.length === 2) {
              return browser.i18n.getMessage("from_ZsiteoneZ_and_ZsitetwoZ", domains);
            } else {
              return browser.i18n.getMessage("from_ZsiteoneZ_ZsitetwoZ_and_ZcountZ_others", [ domains[0], domains[1], domains.length - 2 ]);
            }
          })();

          browser.notifications.create(undefined!, {
            type: "basic",
            title: browser.i18n.getMessage("ZcountZ_Cookies_Deleted", [ totalCount ]),
            message,
            iconUrl: browser.extension.getURL("icons/icon-256.png"),
          });
        }
      }, state.settings.automaticDeletionDelayMillis);
    }
  });
}

initialize();
