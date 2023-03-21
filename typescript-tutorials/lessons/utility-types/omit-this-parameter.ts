export {};

type Test = OmitThisParameter<(this: Window, a: string) => void>;
//   ^?

function callInWindow(this: Window, b: number) {
  console.log(this.innerWidth);
  return b;
}

function bindWindow<Fn extends (this: Window, ...args: any[]) => any>(
  fn: Fn
): OmitThisParameter<Fn> {
  // fn.bind(window)
  return Function.prototype.bind.call(fn, window);
}

const boundCall = bindWindow(callInWindow);
//    ^?

declare const test: Test;
console.log(boundCall, test);
