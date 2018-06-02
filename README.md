# Cookie Crumbler

> An open source browser extension for automatically deleting cookies you don't want.

// Update the URL below!

[![Donate](https://img.shields.io/badge/Donate%20$5-PayPal-brightgreen.svg)](https://paypal.me/downloadmanager/5)

## About

tbd

### Features

tbd

### Supported Browsers

// Update the URLs below!

- Firefox ([view listing](https://addons.mozilla.org/en-US/firefox/addon/synology-download-manager/))
- Chrome ([view listing](https://chrome.google.com/webstore/detail/synology-download-manager/iaijiochiiocodhamehbpmdlobhgghgi))

## Development

### Building the Extension

Install [Yarn](https://github.com/yarnpkg/yarn) if you don't already have it.

1. Install dependencies.

  ```
  yarn
  ```

2. Build all assets.

  ```
  yarn build
  ```

3. _(Optional)_ Build into a `.zip` file at the repo root suitable for distibuting as an addon. This step is not necessary for doing local development, for which you can just point the browser at the repo root or `manifest.json`. It shells out to `zip`, which it assumes is accessible on your `PATH`.

  ```
  yarn zip
  ```
