export {};

const ErrorMap = Map<string, Error>;
const map = new ErrorMap();
//    ^?

class ErrorMapOld extends Map<string, Error> {}

const mapOld = new ErrorMapOld();
//    ^?

console.log(map, mapOld);
