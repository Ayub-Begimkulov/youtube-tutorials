export {};

function addRandomNumber<T>(value: T) {
  value.push(Math.floor(Math.random() * 100));
  //    ^^^^
  // Property 'push' does not exist on type 'T'.ts(2339)
  return value;
}

addRandomNumber([1, 2, 3]);
// should be error! but works...
addRandomNumber(["asdf", "test"]);

function addRandomNumberConstraint<T extends number[]>(value: T) {
  value.push(Math.floor(Math.random() * 100));
  return value;
}

addRandomNumberConstraint([1, 2, 3]);
addRandomNumberConstraint(["asdf", "test"]);
//                         ^^^^^^  ^^^^^^
// Type 'string' is not assignable to type 'number'.ts(2322)
