export {};

function test(arg: unknown) {
  if (typeof arg === "number") {
    console.log(arg + 5);
  }
  if (typeof arg === "string") {
    console.log(arg.charCodeAt(0));
  }
  if (Array.isArray(arg)) {
    console.log(arg.concat([1, 2, 3]));
  }
  if (typeof arg === "object" && arg !== null) {
    console.log({ ...arg });
  }
}

test(1);
