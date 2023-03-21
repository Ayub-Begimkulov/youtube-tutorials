export {};

class Test {
  a = 10;
}

const test1: Test = new Test();
const test2: Test = Test;
//                  ^^^^
// Property 'a' is missing in type 'typeof Test'
// but required in type 'Test'.ts(2741)

const test3: { new (): Test } = Test;

console.log(test1, test2, test3);
