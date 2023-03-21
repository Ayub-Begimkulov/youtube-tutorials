export {};

type AnyFunction = (...args: any[]) => any;

type FnParams = Parameters<(a: number, b: string, c?: boolean) => void>;
//   ^?

function wrapper<Fn extends AnyFunction>(fn: Fn) {
  return function wrapped(...args: Parameters<Fn>) {
    return fn.apply(null, args);
  };
}

const log = (a: number, b?: string) => console.log(a, b);

const wrappedLog = wrapper(log);
//    ^?

declare const test: FnParams;
console.log(wrappedLog);
