export {};

class Test {
  a = 10;
}

type Test1 = InstanceType<new () => Test>;
//   ^?
type Test2 = InstanceType<{ new (): Test }>;
//   ^?
type Test3 = InstanceType<typeof Test>;
//   ^?
type Test4 = InstanceType<StringConstructor>;
//   ^?

declare const test: Test1 & Test2 & Test3 & Test4;

console.log(test);
