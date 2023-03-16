export {};

function pushArrayIncorrect<T extends number[]>(arr: T, item: T[number]) {
  arr.push(item);
  return arr;
}

function pushArray<T extends number>(arr: T[], item: T) {
  arr.push(item);
  return arr;
}

pushArray([1, 2, 3], 4);
pushArrayIncorrect([1, 2, 3], 4);
