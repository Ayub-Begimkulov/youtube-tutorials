const testFunction =
  process.env.TEST_NUMBER === "1" ? calculateCount : calculateCount2;
const runTimes = parseInt(process.env.TIMES) || 10_000;

function calculateCount() {
  let count = 0;

  try {
    for (let i = 0, l = 1_000_000; i < l; i++) {
      count += 0;
    }
  } catch (e) {
    console.log(e);
  }

  return count;
}

function calculateCount2() {
  try {
    return calculateCount2Inner();
  } catch (e) {
    console.log(e);
  }
}

function calculateCount2Inner() {
  let count = 0;

  for (let i = 0, l = 10_000; i < l; i++) {
    count += 0;
  }

  return count;
}

function test() {
  const before = performance.now();
  for (let i = 0; i < runTimes; i++) {
    testFunction();
  }
  const after = performance.now();

  console.log(
    `${testFunction.name} has been ran ${runTimes} times and took ${
      after - before
    }ms`
  );
}

// 1) TIMES=1000, COUNT=1_000_000
// 2) TIMES=100_000, COUNT=10_000
test();
