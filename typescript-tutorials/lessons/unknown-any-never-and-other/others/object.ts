export {};

let a: object = {};
a = () => {};
a = [];

a.foo;
// Property 'foo' does not exist on type 'object'.

a = 1;
a = "asdf";
a = null;
a = undefined;
