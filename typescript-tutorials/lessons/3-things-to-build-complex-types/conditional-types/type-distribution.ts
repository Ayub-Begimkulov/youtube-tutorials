export {};

type Union = "test" | number | {} | any[] | "some_string";
type GetStrings<T> = T extends string ? T : never;

type Test = GetStrings<Union>;
//   ^?

declare let unionVar: Union;
declare let stringVar: string;

stringVar = unionVar;
// ^^^^^^
// Type 'Union' is not assignable to type 'string'.

type Test2 = string | never;
//   ^?

declare const test: Test & Test2;
