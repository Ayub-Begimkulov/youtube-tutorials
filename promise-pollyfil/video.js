export {};

class MyPromise {
  constructor() {}

  then = () => {};

  catch = () => {};
}

const promise = new MyPromise((resolve) => {
  setTimeout(() => resolve("asdf"), 500);
}).then((result) => console.log(result));
