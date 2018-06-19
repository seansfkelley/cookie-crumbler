import { getDomain } from "tldjs";

const IPV4_REGEX = /^(\d{1,3}\.){3,3}\d{1,3}$/;
const IPV6_REGEX = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

export function isIpAddress(hostname: string | null | undefined) {
  if (hostname != null) {
    return IPV4_REGEX.test(hostname) || IPV6_REGEX.test(hostname);
  } else {
    return undefined;
  }
}

export function getHostname(url: string | null | undefined) {
  if (url != null) {
    try {
      return new URL(url).hostname;
    } catch {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getRootDomain(hostname: string | null | undefined) {
  if (hostname != null) {
    return (isIpAddress(hostname) ? hostname : getDomain(hostname)) || undefined;
  } else {
    return undefined;
  }
}
