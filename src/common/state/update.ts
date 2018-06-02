import { StateVersion } from "./version";
import { state0to1 } from "./1";

const ORDERED_TRANSFORMS: ((state: StateVersion<number> | null | undefined) => StateVersion<number>)[] = [
  state0to1,
];

const LATEST_VERSION = ORDERED_TRANSFORMS.length;

export function updateStateToLatest(state: StateVersion<number> | null | undefined) {
  const version = state ? state.version : 0;

  if (version > LATEST_VERSION) {
    throw new Error(`cannot downgrade state shape from ${version} to ${LATEST_VERSION}`);
  }

  ORDERED_TRANSFORMS.slice(version).forEach(transform => {
    state = transform(state);
  });

  return state;
}
