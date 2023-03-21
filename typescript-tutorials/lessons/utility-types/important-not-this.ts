export {};

function fn1(this: Window) {
  console.log(this.innerWidth);
}

window.setTimeout(fn1);

class Test {
  constructor() {
    fn1();
    // ^^^^
    // The 'this' context of type 'void' is not assignable
    // to method's 'this' of type 'Window'.ts(2684)
  }
}

const fn2 = (this: { a: string }, b: string) => b;
//          ^^^^^^^^^^^^^^^^^^^^
// An arrow function cannot have a 'this' parameter.ts(2730)

console.log(Test, fn2);
