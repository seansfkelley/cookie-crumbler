import { HostnameRule, LogEntry } from "./state";

export function deleteCookies(rules: HostnameRule[]): LogEntry {
  const timestamp = new Date().toISOString();



  return {
    timestamp,
  };
}
