export {};

function assertString(value: unknown) {
  if (typeof value !== "string") {
    throw new Error("value must be string");
  }
}

function connectToDb(value: unknown) {
  assertString(value);

  value;
  // ^?
}

connectToDb("asdfadfas");
