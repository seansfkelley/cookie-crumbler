export function isIpAddress(_hostname: string) {
  // TODO for ipv4 and ipv6
  return false;
}

export function getHostname(url: string) {
  return new URL(url).hostname;
}

export function getRootDomain(hostname: string) {
  if (isIpAddress(hostname)) {
    return hostname;
  } else {
    // TODO: Handle nontrivial cases (two-part TLDs, localhost, trailing dots, etc.)
    return hostname.split(".").slice(-2).join(".");
  }
}
