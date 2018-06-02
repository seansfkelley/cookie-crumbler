import '../common/init/extensionContext';

import { updateStateShapeIfNecessary, onStoredStateChange } from "../common/state";

updateStateShapeIfNecessary()
.then(() => {
  onStoredStateChange(state => {
    // Do things here I guess?
  });
});
