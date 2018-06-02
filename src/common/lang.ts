export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export function assertNever(n: never): never {
  throw new Error(`never assertion failed, got value ${n}`);
}

export function spread<T, K extends keyof T>(
  original: T,
  override: Pick<T, K> | T,
  ...addlOverrides: (Partial<T> & Pick<T, K>)[],
): T {
  return Object.assign({}, original, override, ...addlOverrides);
}