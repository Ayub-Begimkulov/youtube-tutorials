export {};

type Test1 = Readonly<{ a: number; c: string; d: { e: string } }>;
//   ^?
type Test2 = Readonly<number[]>;
//   ^?
type Test3 = Readonly<string>;
//   ^?

function freeze<T extends object>(object: T): Readonly<T> {
  return Object.freeze(object);
}

const result = freeze({ a: 5, b: { c: 6 } });
//    ^?

declare const test: Test1 & Test2 & Test3;
console.log(result, test);
