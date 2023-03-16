export {};

const idWrong = (item: unknown) => item;
let resultWrong = idWrong(5);
//  ^?

const id = <T>(item: T) => item;

let result = id(5);
//  ^?

console.log(result, resultWrong);
