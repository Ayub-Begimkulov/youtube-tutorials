export {};

type TestObject = { a: number; b: string; c: boolean };
type Test1 = Omit<TestObject, "a">;
//   ^?
type Test2 = Omit<TestObject, "a" | "b">;
//   ^?

function omitA<Obj extends Record<string, unknown>>(
  object: Obj
): Omit<Obj, "a"> {
  const { a: _, ...rest } = object;

  return rest;
}

declare const object: TestObject;

const result = omitA(object);
//    ^?

declare const test: Test1 & Test2;

console.log(result, test);
