import "chrome-extension-async";

(window as any).browser = (window as any).browser || (window as any).chrome;

import { logger } from "./logger";

(window as any).require = (name: string) => {
  logger.error(`ignoring request to require ${name}`);
};

// TODO: When browser support this natively or Bluebird starts working again.
// window.addEventListener('unhandledrejection', (e: any) => {
//   e.preventDefault();
//   log.error(e);
// });

window.addEventListener("error", e => {
  e.preventDefault();
  logger.error(e);
});

