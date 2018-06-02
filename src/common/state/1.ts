import { StateVersion } from "./version";

export interface Settings_1 {
  enableLocalStorageDeleting: boolean;
  localStorageBehavior: "all-domains" | "matching-cookies";
  enableLogging: boolean;
  enableNotifications: boolean;
  enableInTabDeleting: boolean;
}

export interface HostnameRule_1 {
  hostname: string;
  includeSubdomains: boolean;
  cookieNameWhitelist?: string[];
}

export interface LogEntry_1 {
  timestamp: string;
  deletions: {
    hostname: string;
    count: number;
  }[];
  preservations: {
    hostname: string;
    count: number;
  }[];
}

export interface State_1 extends StateVersion<1> {
  settings: Settings_1;
  rules: HostnameRule_1[];
  logs: LogEntry_1[];
}

export function state0to1(_state: null | undefined): State_1 {
  return {
    version: 1,
    settings: {
      enableLocalStorageDeleting: false,
      localStorageBehavior: "all-domains",
      enableLogging: false,
      enableNotifications: false,
      enableInTabDeleting: false,
    },
    rules: [],
    logs: [],
  };
}
