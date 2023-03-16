export {};

function get<Obj extends object, Key extends keyof Obj>(object: Obj, key: Key) {
  return object[key];
}

const obj = { a: 5, b: "test" };

get(obj, "a");
get(obj, "b");
get(obj, "asdf");
//       ^^^^^^
// Argument of type '"asdf"' is not assignable to parameter of type '"a" | "b"'.
