export {};

const possibleValues = ["test", "hello"] as const;

function isPossibleValue(value: string) {
  return includes(possibleValues, value);
}

function includes<Item>(arr: readonly Item[], item: unknown): item is Item {
  return arr.includes(item as Item);
}

type Falsy = false | 0 | "" | null | undefined | 0n;

function isTruthy<T>(value: T): value is Exclude<T, Falsy> {
  return Boolean(value);
}

const arr = [1, 2, undefined].filter(isTruthy);
//    ^?

console.log(arr, isPossibleValue);
