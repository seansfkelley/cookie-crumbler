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
      // TODO: Consider normalizing out URLs that start with www.
      .map(({ url }) => getRootDomain(getHostname(url!)))
  );

  const deletions: Record<string, number> = {};
  const preservations: Record<string, number> = {};

  // We need to enumerate all cookies stores that exist, else we'll end up just clearing the one from the
  // "current execution context".
  // TODO: How does firstPartyDomain factor into this?
  await Promise.all((await browser.cookies.getAllCookieStores())
    .map(async store => {
      const storeId = store.id;
      return Promise.all(
        (await browser.cookies.getAll({ storeId }))
          .map(async cookie => {
            const normalizedDomain = cookie.domain.replace(/^\./, "");
            if (normalizedDomain === "") {
              // These cookies are set by local files, which have no hostname. (Ever notice that a local
              // file is opened with 3 slashes...? That's the missing hostname.)
              deletions["(local file)"] = (deletions["(local file)"] || 0) + 1;
              return browser.cookies.remove({
                url: `file://${cookie.path}`,
                name: cookie.name,
                storeId,
              });
            } else if (shouldPreserve(normalizedDomain, rules, openRootDomains)) {
              preservations[normalizedDomain] = (preservations[normalizedDomain] || 0) + 1;
              return Promise.resolve();
            } else {
              deletions[normalizedDomain] = (deletions[normalizedDomain] || 0) + 1;
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
