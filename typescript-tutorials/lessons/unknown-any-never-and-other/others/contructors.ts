export {};

Number;
// ^?
Number.prototype;
//     ^?

String;
// ^?
String.prototype;
//     ^?

Symbol;
// ^?
Symbol.prototype;
//     ^?

Boolean;
// ^?
Boolean.prototype;
//      ^?

Function;
// ^?
Function.prototype;
//       ^?

Object;
// ^?
Object.prototype;
//     ^?

// will work but not not recommended
// https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
let a: String = "asdfasdf";
let b: Number = 5;
let c: Symbol = Symbol.for("asdf");
let d: Object = {};

console.log(a, b, c, d);
