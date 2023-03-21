export {};

type Test1 = Uppercase<"asdf">;
//   ^?
type Test2 = Lowercase<"ASDF">;
//   ^?
type Test3 = Capitalize<"asdf">;
//   ^?
type Test4 = Uncapitalize<"Asdf">;
//   ^?

declare const test: Test1 | Test2 | Test3 | Test4;
console.log(test);
