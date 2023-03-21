export {};

type TestUnion = string | number | boolean;
type TestUnion2 = "test" | "test2" | 1 | 2 | false;

type Test1 = Exclude<TestUnion, string>;
//   ^?
type Test2 = Exclude<TestUnion2, string>;
//   ^?
type Test3 = Exclude<TestUnion2, "test" | number>;
//   ^?

function isNotNumber<T>(value: T): value is Exclude<T, number> {
  return typeof value === "number";
}

const arr = [1, 2, 3, "test", undefined, null, {}] as const;
//    ^?
const test = arr.filter(isNotNumber);
//    ^?

declare const test2: Test1 & Test2 & Test3;
console.log(test, test2);
