function multiplyArrayCommon(array) {
  const result = [];

  for (let i = 0, l = array.length; i < l; i++) {
    result.push(array[i] * 2);
  }

  return result;
}

function multiplyArrayImmutable(array) {
  let result = [];

  for (let i = 0, l = array.length; i < l; i++) {
    result = [...result, array[i] * 2];
  }

  return result;
}

const runTimes = parseInt(process.env.TIMES, 10) || 100;
const arraySize = parseInt(process.env.SIZE, 10) || 10_000;
const testFn =
  process.env.TEST_NUMBER === "1"
    ? multiplyArrayCommon
    : multiplyArrayImmutable;

function runTest() {
  const before = performance.now();
  const testArr = createNumberArray(arraySize);
  for (let i = 0; i < runTimes; i++) {
    testFn(testArr);
  }
  const after = performance.now();

  console.log(
    `${testFn.name} has been ran ${runTimes} times and took ${after - before}ms`
  );
}

function createNumberArray(size) {
  return Array.from({ length: size }, () => Math.random());
}

runTest();
