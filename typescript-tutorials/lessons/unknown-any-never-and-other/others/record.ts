export {};

let a: Record<string, unknown> = {};

a.foo;
// ^?

a = () => {};
a = [1, 2, 3];

a = 1;
a = "asdf";
a = true;

a = null;
a = undefined;
