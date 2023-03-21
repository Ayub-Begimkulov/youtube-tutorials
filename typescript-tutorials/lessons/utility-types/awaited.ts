export {};

type NumberPromise = Promise<number>;
type StringPromise = Promise<string>;

type Test1 = Awaited<NumberPromise>;
//   ^?
type Test2 = Awaited<StringPromise>;
//   ^?

const asyncFn = () => Promise.resolve({ prop1: 5, prop2: "test" });

type AsyncFnReturnIncorrect = ReturnType<typeof asyncFn>;
//   ^?
type AsyncFnReturn = Awaited<ReturnType<typeof asyncFn>>;
//   ^?

declare const test: Test1 & Test2 & AsyncFnReturnIncorrect & AsyncFnReturn;
