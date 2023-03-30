export {};

type GetArrayValue<T extends any[]> = T extends (infer Item)[] ? Item : never;

type Test = GetArrayValue<number[]>;
//   ^?
type Test2 = GetArrayValue<(number | string)[]>;
//   ^?

type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer Return
  ? Return
  : never;

type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer Args
) => any
  ? Args
  : never;

type TestReturnType1 = MyReturnType<() => number>;
//   ^?
type TestReturnType2 = MyReturnType<() => string>;
//   ^?
type TestParameters1 = MyParameters<(...args: number[]) => number>;
//   ^?
type TestParameters2 = MyParameters<(a: number, b?: string) => string>;
//   ^?

declare const test:
  | Test2
  | Test
  | TestParameters1
  | TestParameters2
  | TestReturnType1
  | TestReturnType2;
