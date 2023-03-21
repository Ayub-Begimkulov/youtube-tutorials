export {};

type TestUnion = string | number | boolean | undefined | null;
type TestUnion2 = "test" | "test2" | 1 | 2 | false | undefined | null;

type Test1 = NonNullable<TestUnion>;
//   ^?
type Test2 = NonNullable<TestUnion2>;
//   ^?
type Test3 = Exclude<TestUnion2, null | undefined>;
//   ^?

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== null;
}

const result = [1, null, undefined, "test", ["asdf"]].filter(isNonNullable);
//    ^?

type ItemType = typeof result[number];
//   ^?

declare const test: Test1 & Test2 & Test3 & ItemType;

console.log(result, test);
