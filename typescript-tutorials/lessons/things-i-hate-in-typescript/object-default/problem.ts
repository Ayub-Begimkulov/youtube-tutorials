export {};

let myObject = {};
//  ^?

myObject["asdf"] = 5;
// ^^^^^^^^^^^^^
// Element implicitly has an 'any' type
// because expression of type '"asdf"' can't
// be used to index type '{}'.

myObject = "asdf";
myObject = 5;
