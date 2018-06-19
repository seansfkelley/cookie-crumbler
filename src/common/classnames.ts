import * as classNamesProxy from 'classnames';

// https://github.com/rollup/rollup/issues/1267
export const classNames: typeof classNamesProxy = (classNamesProxy as any).default || classNamesProxy;
