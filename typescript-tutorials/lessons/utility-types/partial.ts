export {};

type Test1 = Partial<{ a: number; b: string }>;
//   ^?
type Test2 = Partial<[1, 2, "asdf"]>;
//   ^?
type Test3 = Partial<number[]>;
//   ^?
type Test4 = Partial<string>;
//   ^?

interface Config {
  prop1: number;
  prop2: string;
  test: number[];
}
const baseConfig: Config = { prop1: 1, prop2: "2", test: [1] };

function extendConfig(override: Partial<Config>): Config {
  return { ...baseConfig, ...override };
}

const result = extendConfig({ test: [1, 2, 3] });
//    ^?

declare const test: Test1 & Test2 & Test3 & Test4;

console.log(test, result);
