import { StateVersion } from "./version";

export interface Settings_1 {
  enableAutomaticDeletion: boolean;
  automaticDeletionDelayMillis: number;
  enableLocalStorageDeletion: boolean;
  localStorageBehavior: "all-domains" | "matching-cookies";
  enableLogging: boolean;
  enableNotifications: boolean;
  enableInTabDeletion: boolean;
}

export interface HostnameRule_1 {
  hostname: string;
  includeSubdomains: boolean;
  cookieNameWhitelist?: string[];
}

// export interface LogEntry_1 {
//   hostname: string;
//   count: number;
// }

export interface LogBatch_1 {
  timestamp: string;
  deletions: Record<string, number>;
  preservations: Record<string, number>;
}

export interface State_1 extends StateVersion<1> {
  settings: Settings_1;
  rules: HostnameRule_1[];
  logs: LogBatch_1[];
}

export function state0to1(_state: null | undefined): State_1 {
  return {
    version: 1,
    settings: {
      // TODO: Should default off.
      enableAutomaticDeletion: true,
      // TODO: Should default higher.
      automaticDeletionDelayMillis: 500,
      enableLocalStorageDeletion: true,
      localStorageBehavior: "matching-cookies",
      enableLogging: true,
      enableNotifications: true,
      enableInTabDeletion: false,
    },
    rules: [
      {
        hostname: "google.com",
        includeSubdomains: true,
      }, {
        hostname: "nytimes.com",
        includeSubdomains: false,
      }, {
        hostname: "github.com",
        includeSubdomains: true,
      }
    ],
    logs: [],
  };
}
