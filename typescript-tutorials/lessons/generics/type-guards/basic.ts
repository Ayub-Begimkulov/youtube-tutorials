export {};

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== null;
}

const result = [1, 2, undefined, "asdf", { a: 5 }].filter(isNonNullable);
//    ^?

function hasOwn<Obj extends object>(
  object: Obj,
  key: PropertyKey
): key is keyof Obj {
  return Object.hasOwn(object, key);
}

const obj = {
  a: 1,
  b: "asdf",
};

function test(key: string) {
  if (hasOwn(obj, key)) {
    key;
    // ^?
  }
}

console.log(test("c"), result);
