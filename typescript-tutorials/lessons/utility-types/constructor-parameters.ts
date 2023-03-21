export {};

class Test {
  a: number;
  constructor(a: number) {
    this.a = a;
  }
}

type Test1 = ConstructorParameters<typeof Test>;
//   ^?
type Test2 = ConstructorParameters<new (a: number) => Test>;
//   ^?
type Test3 = ConstructorParameters<StringConstructor>;
//   ^?
type Test4 = ConstructorParameters<typeof MutationObserver>;
//   ^?

declare const test: Test1 & Test2 & Test3 & Test4;

console.log(test);
