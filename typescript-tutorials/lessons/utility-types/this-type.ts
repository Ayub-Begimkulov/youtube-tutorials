export {};

function callInWindow(this: Window, b: number) {
  console.log(this.innerWidth);
  return b;
}

function thisAsArgument<Fn extends (this: any, ...args: any[]) => any>(fn: Fn) {
  return function (thisArg: ThisType<Fn>, ...args: Parameters<Fn>) {
    return fn.apply(thisArg, args);
  };
}

const callInWindowThisAsArgument = thisAsArgument(callInWindow);

class Test {
  constructor() {
    callInWindow(5);
    // ^^^^^^^^^^^^
    // The 'this' context of type 'void' is
    // not assignable to method's 'this' of type 'Window'.ts(2684)
    callInWindowThisAsArgument(window, 5);
  }
}

console.log(Test);
