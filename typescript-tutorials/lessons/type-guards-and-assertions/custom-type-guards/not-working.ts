export {};

function isString(value: unknown) {
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
