export {};

type AddNull<T> = {
  [Key in keyof T]: T[Key] | null;
};

type MyOject = {
  a: number;
  b: string;
};

type Test = AddNull<MyOject>;
//   ^?

type TestArray = AddNull<number[]>;
//   ^?
type TestTuple = AddNull<[number, string, boolean]>;
//   ^?
type TestString = AddNull<string>;
//   ^?
type TestNumber = AddNull<number>;
//   ^?

declare const test: Test & TestArray & TestTuple & TestString & TestNumber;
