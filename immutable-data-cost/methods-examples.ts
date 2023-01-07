const array = [1, 2, 3, 4];
const object = {
  a: 1,
  b: 2,
  c: "asdf",
};

// ==========================
// COPY
// ==========================
const copy1 = {
  ...object,
};

// mutates 1st object
const copy2 = Object.assign({}, object);

const copy3 = [...array];
const copy4 = array.slice();
const copy5 = array.concat([]);

function immutableCopyArray<T>(array: T[]) {
  const newArray: T[] = [];

  for (let i = 0, l = array.length; i < l; i++) {
    newArray[i] = array[i];
  }

  return newArray;
}

function immutableCopyObject<T>(object: Record<string, T>) {
  const newRecord = {};

  for (const key in object) {
    newRecord[key] = object[key];
  }

  return newRecord;
}

// ==========================
// iterate
// ==========================
const filtered = array.filter((item) => item > 0);
const mapped = array.map((item) => item * 1);

Object.keys(object).forEach((key) => {
  console.log(key, object[key]);
});

Object.values(object).forEach((value) => {
  console.log(value);
});

Object.entries(object).forEach(([key, value]) => {
  console.log(key, value);
});

for (const key in object) {
  const value = object[key];
  console.log(key, value);
}
