// This gets ts-node to pull in the typings for the `chrome` object, so that when
// we try to test a file that includes references to it, it compiles.
//
// Note that chrome-extension-async actually executes code upon import, so we give it
// a global chrome object to mangle.
//
// If you actually hit a branch that makes a call to something on the chrome object,
// the behavior is undefined. This file is specifically to get the typings to check
// out. I wasn't able to find a simpler way to pull in the proper browser typings
// without it, though.
//
// Note that tsconfig-test.json's inclusion of browser.d.ts is also necessary, we
// we generally refer to it as `browser`, not `chrome`!

(global as any).chrome = {};
import "chrome-extension-async";
