export {};

function wrap<Fn extends (...args: unknown[]) => unknown>(fn: Fn) {
  return function wrapped(...args) {
    return fn.apply(null, args);
  } as Fn;
}

wrap((a: number) => a * 2);
// Argument of type '(a: number) => number' is not assignable
// to parameter of type '(...args: unknown[]) => unknown'.
