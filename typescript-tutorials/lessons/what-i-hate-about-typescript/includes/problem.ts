export {};

const possibleValues = ["test", "hello"] as const;
//    ^?

function isPossibleValue(value: string) {
  return possibleValues.includes(value);
  //                             ^^^^^
  // Argument of type 'string' is not assignable to
  // parameter of type '"test" | "hello"'.ts(2345)
}

const arr = [1, 2, undefined].filter(Boolean);
//    ^?

console.log(arr, isPossibleValue);
