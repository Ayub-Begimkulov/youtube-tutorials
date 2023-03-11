export {};

function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("value must be string");
  }
}

function connectToDb(value: unknown) {
  assertString(value);

  value;
  // ^?
}

connectToDb("asdfasdf");

// custom

interface Options {
  a: number;
  b: string;
}

function assertOptions(value: unknown): asserts value is Options {
  if (value === null || typeof value !== "object") {
    throw new Error("options must me of type object");
  }

  if (!("a" in value) || typeof value.a !== "number") {
    throw new Error("options.a must me of string");
  }

  if (!("b" in value) || typeof value.b !== "string") {
    throw new Error("options.b must me of string");
  }
}

function doSomething(value: unknown) {
  assertOptions(value);

  value;
  // ^?
}

doSomething("asdfasdf");
