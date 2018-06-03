import { padEnd } from "lodash-es";

let enableLogging: boolean = true;

export function disableLoggingForTests() {
  enableLogging = false;
}

function wrap(which: "debug" | "log" | "warn" | "error") {
  return (...args: any[]) => {
    if (enableLogging) {
      console[which](`${padEnd(which, 5)} [${new Date().toISOString()}]`, ...args);
    }
  };
}

export const logger = {
  debug: wrap("debug"),
  info: wrap("log"),
  warn: wrap("warn"),
  error: wrap("error"),
};
