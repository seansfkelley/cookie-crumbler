import { HostnameRule, LogBatch } from "./state";

import { getRootDomain, getHostname } from "./util";

export function shouldPreserve(domain: string, rules: HostnameRule[], openRootDomains: Set<string>) {
  const normalizedDomain = domain.replace(/^\./, "");
  return (
    openRootDomains.has(getRootDomain(normalizedDomain)) ||
    rules.some(r =>
      r.hostname === normalizedDomain || (r.includeSubdomains && normalizedDomain.endsWith(r.hostname))
    )
  );
}

export async function deleteCookies(rules: HostnameRule[]): Promise<LogBatch> {
  const timestamp = new Date().toISOString();

  const openRootDomains = new Set(
    (await browser.tabs.query({ windowType: "normal" }))
      .filter(({ url }) => url != null && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file://")))
      .map(({ url }) => getRootDomain(getHostname(url!)))
  );

  const deletions: Record<string, number> = {};
  const preservations: Record<string, number> = {};

  function increment(counter: Record<string, number>, key: string) {
    counter[key] = (counter[key] || 0) + 1;
  }

  // We need to enumerate all cookies stores that exist, else we'll end up just clearing the one from the
  // "current execution context".
  // TODO: How does firstPartyDomain factor into this?
  await Promise.all((await browser.cookies.getAllCookieStores())
    .map(async store => {
      const storeId = store.id;
      return Promise.all(
        (await browser.cookies.getAll({ storeId }))
          .map(async cookie => {
            // TODO: Consider normalizing out URLs that start with www.
            const normalizedDomain = cookie.domain.replace(/^\./, "");
            if (normalizedDomain === "") {
              // These cookies are set by local files, which have no hostname. (Ever notice that a local
              // file is opened with 3 slashes...? That's the missing hostname.)
              increment(deletions, "(local file)");
              return browser.cookies.remove({
                url: `file://${cookie.path}`,
                name: cookie.name,
                storeId,
              });
            } else if (shouldPreserve(normalizedDomain, rules, openRootDomains)) {
              increment(preservations, normalizedDomain);
              return Promise.resolve();
            } else {
              increment(deletions, normalizedDomain);
              return browser.cookies.remove({
                url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`,
                name: cookie.name,
                storeId,
              });
            }
          })
      );
    })
  );

  return {
    timestamp,
    deletions,
    preservations,
  };
}
