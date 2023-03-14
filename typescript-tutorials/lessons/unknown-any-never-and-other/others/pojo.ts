export {};

let a: {} = {};
a = [];
a = () => {};

a.foo;
// Property 'foo' does not exist on type '{}'

a = "asdf";
a = 1234;
a = false;

a = null;
a = undefined;
