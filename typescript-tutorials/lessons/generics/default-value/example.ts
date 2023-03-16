export {};

type Box<T = unknown> = { value: T };
interface Optional<T = unknown> {
  value?: T;
}
const createTypedId =
  <T = number>() =>
  (value: T) =>
    value;

class Wrapper<T = string> {
  value: T | undefined;

  set(value: T) {
    this.value = value;
  }
}

// no value
type Test = Box;
//   ^?
type Test2 = Optional;
//   ^?
const id = createTypedId();
//    ^?
const a = new Wrapper();
//    ^?

declare const test: Test & Test2;
console.log(id, a, test);
