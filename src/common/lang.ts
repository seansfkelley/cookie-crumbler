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
