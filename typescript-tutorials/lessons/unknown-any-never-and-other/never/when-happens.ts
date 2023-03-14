export {};

function example1(value: number | string) {
  if (typeof value === "object") {
    value;
    // ^?
  }
}

example1(1);

function example2(key: "a" | "b" | "c") {
  switch (key) {
    case "a":
      return "a-key";
    case "b":
      return "key-b";
    case "c":
      return "key-c-key";
    default:
      return key;
    //       ^?
  }
}

example2("a");

function example3() {
  const test = () => {
    throw new Error("test");
  };

  const a = test();
  //    ^?

  console.log(a);
}

example3();
