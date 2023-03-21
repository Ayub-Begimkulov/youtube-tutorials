export {};

type TestUnion = string | number | boolean;
type TestUnion2 = "test" | "test2" | 1 | 2 | false;

type Test1 = Extract<TestUnion, string>;
//   ^?
type Test2 = Extract<TestUnion2, string>;
//   ^?
type Test3 = Extract<TestUnion2, "test" | number>;
//   ^?

function isNumberExtract<T>(value: T): value is Extract<T, number> {
  return typeof value === "number";
}

const isNumber = (value: unknown): value is number => typeof value === "number";

const arr = [1, 2, 3, "test", undefined, null, {}] as const;
//    ^?
const test = arr.filter(isNumberExtract);
//    ^?
const test2 = arr.filter(isNumber);
//    ^?

declare const test3: Test1 & Test2 & Test3;
console.log(test, test2, test3);
