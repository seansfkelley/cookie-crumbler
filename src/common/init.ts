import "chrome-extension-async";

(window as any).browser = (window as any).browser || (window as any).chrome;

// TODO: When browser support this natively or Bluebird starts working again.
// window.addEventListener('unhandledrejection', (e: any) => {
//   e.preventDefault();
//   console.error(e);
// });

window.addEventListener("error", e => {
  e.preventDefault();
  console.error(e);
});

