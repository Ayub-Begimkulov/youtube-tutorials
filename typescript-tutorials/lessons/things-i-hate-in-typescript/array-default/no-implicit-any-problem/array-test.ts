export {};

// strictNullCheck - true, noImplicitAny - false
const myArray = [];
//    ^?

myArray.push("asdf");
//           ^^^^^^
// Argument of type 'string' is not assignable
// to parameter of type 'never'.ts(2345)

myArray.push(5);
//           ^
// Argument of type 'number' is not assignable
// to parameter of type 'never'.ts(2345)
