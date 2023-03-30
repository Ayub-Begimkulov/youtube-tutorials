export {};

type Head<Arr extends readonly any[]> = Arr extends readonly [
  infer First,
  ...any[]
]
  ? First
  : Arr[number];

function head<Arr extends readonly any[]>(arr: Arr): Head<Arr> {
  return arr[0];
}

const arr = [1, 2, 3];
//    ^?
const arrReadonly = [1, 2, 3] as const;
//    ^?
const firstItem = head(arr);
//    ^?
const firstItemReadonly = head(arrReadonly);
//    ^?

console.log(firstItem, firstItemReadonly);
