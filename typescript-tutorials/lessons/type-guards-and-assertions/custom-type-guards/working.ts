export {};

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function test(value: unknown) {
  if (isString(value)) {
    value;
    // ^?
  } else {
    value;
    // ^?
  }
}

test("asdf");
