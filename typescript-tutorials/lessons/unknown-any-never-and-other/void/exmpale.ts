export {};

function example1(): void {
  console.log("test");
}

function example2(): void {
  console.log("test");

  return undefined;
}

example1();
example2();
