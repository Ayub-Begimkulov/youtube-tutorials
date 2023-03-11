export {};

// typeof
function test(value: unknown) {
  if (typeof value === "string") {
    value;
    // ^?
  } else {
    value;
    // ^?
  }
}

test("asdf");

// if/else (4.8)
function test2(value: unknown) {
  if (value) {
    value;
    // ^?
  } else {
    value;
    // ^?
  }
}

test2(5);

// !== null/undefined (4.8)
function test3(value: unknown) {
  // will not work with `typeof value !== 'undefined'`
  if (value !== undefined && value !== null) {
    value;
    // ^?
  } else {
    value;
    // ^?
  }
}

test3("asdf");

// in (4.9)
function test4(value: object) {
  if ("key" in value) {
    value;
    // ^?
  } else {
    value;
    // ^?
  }
}

test4({});
