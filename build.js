const path = require('path');
const rollup = require('rollup');
const watch = require('rollup-watch');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const sourcemaps = require('rollup-plugin-sourcemaps');
const json = require('rollup-plugin-json');

function formatLoc(loc) {
  return `${loc.file}@${loc.line}:${loc.column}`;
}

function watchEventHandler(event, filename) {
  switch (event.code) {
    case 'STARTING':
      console.error('checking rollup-watch version...');
      break
    case 'BUILD_START':
      console.error(`bundling ${filename}...`);
      break;
    case 'BUILD_END':
      console.error(`${filename} bundled in ${event.duration}ms. Watching for changes...`);
      break;
    case 'ERROR':
      console.error(`${formatLoc(event.error.loc)}: ${event.error}`);
      break;
    default:
      console.error(`unknown event: ${event}`);
  }
}

function bundleAndMaybeWatch(baseDirectory) {
  const config = {
    // TODO: Typescript in rollup rather than separately?
    entry: `lib/${baseDirectory}/index.js`,
    dest: `dist/js/${baseDirectory}.js`,
    format: 'es',
    sourceMap: true,
    plugins: [
      resolve({
        main: true,
        browser: true,
        preferBuiltins: false
      }),
      json(),
      commonjs({
        namedExports: {
          'react': [ 'Component', 'PureComponent', 'createElement', 'Fragment' ],
          'react-dom': [ 'render' ]
        }
      }),
      globals(),
      builtins(),
      sourcemaps()
    ],
    onwarn: (({ code, message, loc }) => {
      console.warn(`${formatLoc(loc)}: ${message}`);
    })
  };

  if (process.argv.indexOf('-w') !== -1) {
    console.error(`will watch for changes and rebundle ${config.entry}`);
    watch(rollup, config)
      .on('event', e => watchEventHandler(e, config.entry));
  } else {
    console.error(`building ${config.entry}`);
    rollup.rollup(config)
      .then(bundle => {
        bundle.write(config);
      });
  }
}

bundleAndMaybeWatch('settings');
bundleAndMaybeWatch('background');
bundleAndMaybeWatch('popup');
