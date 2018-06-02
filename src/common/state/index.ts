import { updateStateToLatest } from "./update";
import { BrowserStorageEngine, StorageEngine } from "./storage";

export * from "./latest";
export { StateService } from "./service";
export { StorageEngine } from "./storage";

export function getStorageEngine(): Promise<StorageEngine> {
  const engine = new BrowserStorageEngine();

  return engine
    .transitionState(updateStateToLatest)
    .then(() => engine);
}

