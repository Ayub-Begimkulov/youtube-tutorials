export {};

type IsNumber<T> = T extends number ? true : false;

type Test1 = IsNumber<number>;
//   ^?
type Test2 = IsNumber<0>;
//   ^?
type Test3 = IsNumber<0 | 1 | 2>;
//   ^?
type Test4 = IsNumber<string>;
//   ^?
type Test5 = IsNumber<number | string>;
//   ^?

declare const test: Test1 & Test2 & Test3 & Test4 & Test5;
