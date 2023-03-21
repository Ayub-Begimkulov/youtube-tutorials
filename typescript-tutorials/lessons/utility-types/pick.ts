export {};

type TestObject = { a: number; b: string; c: boolean };
type Test1 = Pick<TestObject, "a">;
//   ^?
type Test2 = Pick<TestObject, "a" | "b">;
//   ^?

function pick<Obj extends Record<string, unknown>, Keys extends keyof Obj>(
  object: Obj,
  keys: Keys[]
): Pick<Obj, Keys> {
  const result = {} as Pick<Obj, Keys>;
  keys.forEach((key) => {
    result[key] = object[key];
  });
  return result;
}

declare const object: TestObject;

const result = pick(object, ["a", "c"]);
//    ^?

declare const test: Test1 & Test2;

console.log(result, test);
