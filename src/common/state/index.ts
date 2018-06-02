import { updateStateToLatest } from "./update";
import { BrowserStorageEngine, StorageEngine } from "./storage";

export * from "./latest";
export { StateService } from "./service";
export { StorageEngine } from "./storage";

export async function getStorageEngine(): Promise<StorageEngine> {
  const engine = new BrowserStorageEngine();
  await engine.transitionState(updateStateToLatest);
  return engine;
}

