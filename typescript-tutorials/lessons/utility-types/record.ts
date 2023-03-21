export {};

type Test1 = Record<string, unknown>;
//   ^?
type Test2 = { [x: string]: unknown };

const object: Record<string, number> = {
  a: 5,
  b: 6,
};

declare const test: Test1 & Test2;
console.log(test, object);
