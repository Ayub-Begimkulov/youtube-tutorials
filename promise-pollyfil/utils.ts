export function asap(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 0);
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "then" in value &&
      typeof value.then === "function"
  );
}
