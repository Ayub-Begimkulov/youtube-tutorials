function filterNumbersImmutable(array) {
  return array.map((item) => item * 2).filter((item) => item >= 1_000);
}

function filterNumbers(array) {
  const filteredArray = [];

  array.forEach((item) => {
    const multiplied = item * 2;

    if (multiplied < 1_000) {
      return;
    }

    filteredArray.push(item);
  });

  return filteredArray;
}
const runTimes = parseInt(process.env.TIMES, 10) || 100;
const arraySize = parseInt(process.env.SIZE, 10) || 10_000;
const testFn =
  process.env.TEST_NUMBER === "1" ? filterNumbers : filterNumbersImmutable;

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
  return Array.from({ length: size }, () => Math.random() * 1000);
}

runTest();
