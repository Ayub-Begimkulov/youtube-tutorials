const testFunction =
  process.env.TEST_NUMBER === "1" ? calculateCount : calculateCount2;
const runTimes = parseInt(process.env.TIMES) || 10_000;
const iterations = parseInt(process.env.ITERATIONS) || 10_000;

function calculateCount() {
  let count = 0;

  try {
    for (let i = 0, l = iterations; i < l; i++) {
      count += i;
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

  for (let i = 0, l = iterations; i < l; i++) {
    count += i;
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

test();
