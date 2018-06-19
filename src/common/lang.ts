import { isEqual } from "lodash-es";

export function assertNever(n: never): never {
  throw new Error(`never assertion failed, got value ${n}`);
}

export function spread<T, K extends keyof T>(
  original: T,
  override: Pick<T, K> | T,
  ...addlOverrides: (Partial<T> & Pick<T, K>)[]
): T {
  return Object.assign({}, original, override, ...addlOverrides);
}

export function isEqualT<T>(a: T, b: T) {
  return isEqual(a, b);
}

export function dropIndex<T>(array: T[], index: number) {
  const newArray = array.slice();
  newArray.splice(index, 1);
  return newArray;
}

export function replaceIndex<T>(array: T[], index: number, item: T) {
  const newArray = array.slice();
  newArray[index] = item;
  return newArray;
}

export type PropertyNamesOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
