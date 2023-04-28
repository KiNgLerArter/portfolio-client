export type ArrayMutationMethods =
  | "push"
  | "splice"
  | "pop"
  | "shift"
  | "unshift";

export type ImmutableArray<TObj> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayMutationMethods>
>;

export type LimitedArray<
  T,
  L extends number,
  TObj = [T, ...Array<T>]
> = TObj & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};
