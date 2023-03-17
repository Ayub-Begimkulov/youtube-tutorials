export {};

function pushArrayIncorrect<T extends unknown[]>(arr: T, item: T[number]) {
  arr.push(item);
  return arr;
}

function pushArray<T>(arr: T[], item: T) {
  arr.push(item);
  return arr;
}

pushArray([1, 2, 3], 4);
pushArrayIncorrect([1, 2, 3], 4);
