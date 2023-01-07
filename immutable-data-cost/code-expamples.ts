function filterNumbersNotOptimal(array: number[]) {
  return array
    .filter((item) => item % 2 === 0) // O(N) cpu + memory
    .map((item) => item * 2) // O(N) cpu + memory
    .filter((item) => item >= 1_000); // O(N) cpu + memory
}

function filterNumbersOptimal(array: number[]) {
  const filteredArray: number[] = [];

  array.forEach((item) => {
    if (item % 2 === 1) {
      return;
    }

    const multiplied = item * 2;

    if (multiplied < 1_000) {
      return;
    }

    filteredArray.push(item);
  });

  return filteredArray;
}

function flattenOneNotOptimal<T>(arrays: T[][]) {
  return arrays.reduce((result, array) => result.concat(array), []);
}

function flattenOneOptimal<T>(arrays: T[][]) {
  return arrays.reduce((result, array) => {
    // return result.push(...array);
    return result.push.apply(result, array);
  }, []);
}

function updateObjectValuesNotOptimal(object: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, value * 2])
  );
}

function updateObjectValuesOptimal(object: Record<string, number>) {
  const newObject: Record<string, number> = {};

  for (const key in object) {
    newObject[key] = object[key] * 2;
  }

  return newObject;
}

function sumTwoNotOptimal(array: number[], sum: number) {
  //   const set = new Set([...array]);
  const set = new Set(array);

  for (let i = 0, l = array.length; i < l; i++) {
    const num = array[i];
    const difference = sum - num;

    if (set.has(difference)) {
      return true;
    }
  }

  return false;
}

function sumTwoOptimal(array: number[], sum: number) {
  const set = new Set();

  for (let i = 0, l = array.length; i < l; i++) {
    const num = array[i];
    const difference = sum - num;

    if (set.has(difference)) {
      return true;
    }

    set.add(num);
  }

  return false;
}
