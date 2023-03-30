export {};

type FirstIfString<T extends any[]> = T extends [infer S, ...unknown[]]
  ? S extends string
    ? S
    : never
  : never;

type FirstIfStringNew<T extends any[]> = T extends [
  infer S extends string,
  ...unknown[]
]
  ? S
  : never;

type Test1 = FirstIfString<[string, number, number]>;
//   ^?
type Test2 = FirstIfStringNew<[string, number, number]>;
//   ^?
type Test3 = FirstIfString<[boolean, number, string]>;
//   ^?
type Test4 = FirstIfStringNew<[boolean, number, string]>;
//   ^?

declare const test: Test1 | Test2 | Test3 | Test4;
