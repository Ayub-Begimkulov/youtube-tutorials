export {};

type Test = ThisParameterType<(this: Window, a: string) => void>;
//   ^?

function callInWindow(this: Window, b: number) {
  console.log(this.innerWidth);
  return b;
}

function thisAsArgument<Fn extends (this: any, ...args: any[]) => any>(fn: Fn) {
  return function (thisArg: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
    return fn.apply(thisArg, args);
  };
}

const callInWindowThisAsArgument = thisAsArgument(callInWindow);
//    ^?
class TestClass {
  constructor() {
    callInWindow(5);
    // ^^^^^^^^^^^^
    // The 'this' context of type 'void' is
    // not assignable to method's 'this' of type 'Window'.ts(2684)
    callInWindowThisAsArgument(window, 5);
  }
}

declare const test: Test;
console.log(TestClass, test);
