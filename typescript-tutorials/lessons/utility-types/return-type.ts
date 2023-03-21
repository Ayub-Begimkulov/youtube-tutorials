export {};

type FnReturn1 = ReturnType<() => number>;
//   ^?
type FnReturn2 = ReturnType<(a: number) => string>;
//   ^?

declare const test: FnReturn1 & FnReturn2;

console.log(test);
