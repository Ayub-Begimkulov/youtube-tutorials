export {};

type Test1 = Required<{ a?: number; b: string | undefined | null }>;
//   ^?
type Test2 = Required<[1 | undefined | null, 2?, "asdf"?]>;
//   ^?
type Test3 = Required<(number | undefined | null)[]>;
//   ^?
type Test4 = Required<string | undefined | null>;
//   ^?

interface Config {
  prop1?: number;
  prop2?: string;
  test?: number[];
}
const baseConfig: Required<Config> = {
  //  ^^^^^^^^^^
  // property 'test' is missing in type '{ prop1: number; prop2: string; }'
  // but required in type 'Required<Config>'.ts(2741)
  prop1: 1,
  prop2: "2",
};

declare const test: Test1 & Test2 & Test3 & Test4;

console.log(test, baseConfig);
