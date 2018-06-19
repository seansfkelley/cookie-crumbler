import { values, sum } from "lodash-es";

import { State, StateService } from "./state";
import { deleteCookies } from "./deletion";

export async function deleteCookiesAndNotify(state: State, service: StateService) {
  const log = await deleteCookies(state.rules);
  const deletionCount = sum(values(log.deletions));;

  if (deletionCount > 0) {
    service.addLogBatch(log);
  }

  if (state.settings.enableNotifications && deletionCount > 0) {
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
}
