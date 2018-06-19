import { values, sum } from "lodash-es";

import { State, StateService } from "../common/state";
import { deleteCookies } from "../common/deletion";
import { logger } from "../common/logger";
import { getHostname } from "../common/util";

export class TabEventHandler {
  private cleanTimeoutId: number | undefined;

  constructor(private state: State, private service: StateService) {}

  public updateState = (state: State) => {
    if (!state.settings.enableAutomaticDeletion) {
      this.clearTimeout();
    }

    this.state = state;
  }

  public onUpdatedListener = async (_tabId: number, _info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (tab.status === "complete") {
      const cookies = await browser.cookies.getAll({
        // Empty string -> no matches (usually).
        domain: (tab.url ? getHostname(tab.url) : undefined) || "",
      });

      browser.browserAction.setBadgeText({
        text: cookies.length.toString() || "",
        tabId: tab.id,
      });

      // TODO: Update badge and icon.
    }
  }

  public onRemovedListener = () => {
    if (this.state.settings.enableAutomaticDeletion && this.cleanTimeoutId == null) {
      logger.debug("automatic deletion enabled and no pending deletion, will start new one");
      // Refer to window specifically because we're pulling in types for Node's globals, which are different...
      // TODO: Also use alarms, because browsers will unload the extension after a certain amount of time...
      this.cleanTimeoutId = window.setTimeout(async () => {
        this.clearTimeout();

        const log = await deleteCookies(this.state!.rules);
        const deletionCount = sum(values(log.deletions));;

        if (deletionCount > 0) {
          this.service.addLogBatch(log);
        }

        if (this.state!.settings.enableNotifications && deletionCount > 0) {
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
            title: browser.i18n.getMessage("ZcountZ_Cookies_Deleted", [ deletionCount ]),
            message,
            iconUrl: browser.extension.getURL("icons/icon-256.png"),
          });
        }
      }, this.state.settings.automaticDeletionDelayMillis);
    }
  }

  private clearTimeout() {
    window.clearTimeout(this.cleanTimeoutId);
    this.cleanTimeoutId = undefined;
  }
}
