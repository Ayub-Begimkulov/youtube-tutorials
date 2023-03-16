export {};

function filter<Item, FilteredItem extends Item>(
  arr: Item[],
  predicate: (
    value: Item,
    index: number,
    originalArray: Item[]
  ) => value is FilteredItem
) {
  return arr.filter(predicate);
}

const isNumber = (value: unknown): value is number => typeof value === "number";

const arr = [1, "asdf", 2, null];

const resultWrapper = filter(arr, isNumber);
//    ^?
const resultCustom = arr.filter(isNumber);
//    ^?

console.log(resultWrapper, resultCustom);
