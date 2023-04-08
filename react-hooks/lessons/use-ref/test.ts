export {};

// 1
const myArray = [];

if (true) {
  myArray.push(5);
  //           ^
  // Argument of type 'number' is not assignable
  // to parameter of type 'never'.ts(2345)
}

const item = 5;

myArray.push(item);
//           ^^^^
// Argument of type 'any' is not assignable
// to parameter of type 'never'.ts(2345)

// 2
let myObject = {};
//  ^?

myObject = "asdf";
myObject = 5;

// 3
type MyFnType = ((val: number) => void) | ((val: string) => void);

let myFn: MyFnType = (arg) => {
  //                    ^?
  // Parameter 'arg' implicitly has an 'any' type.ts(7006)
};

myFn();

// 4 - Boolean and includes
const possibleValues = ["test", "hello"] as const;

function isPossibleValue(value: string) {
  return possibleValues.includes(value);
  //                             ^^^^^
  // Argument of type 'string' is not assignable to
  // parameter of type '"test" | "hello"'.ts(2345)
}

const arr = [1, 2, undefined].filter(Boolean);
//    ^?

console.log(arr, isPossibleValue);

// 5 - compose/pipe types
// https://github.com/reduxjs/redux/blob/master/src/compose.ts
// https://github.com/gcanti/fp-ts/blob/master/src/function.ts#L425

// 6 HOCs
function withHistory<Props extends { history?: Window["history"] }>(
  Component: React.ComponentType<Props>
) {
  function WrappedComponent(props: Omit<Props, "history">) {
    const componentProps = {
      ...props,
      history: window.history,
    };
    return <Component {...componentProps} />;
    //      ^^^^^^^^^
    //  'Omit<Props, "history"> & { history: History; }' is assignable to
    // the constraint of type 'Props', but 'Props' could be instantiated
    // with a different subtype of constraint '{ history?: History; }'.ts(2322)
  }

  WrappedComponent.displayName = `withHistory(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}

withHistory;

// 7 no throw types
function validateLimit(limit: number) {
  if (limit < 0 && limit > 1_000) {
    throw new Error("invalid limit");
  }

  return limit;
}

function main() {
  const limit1 = validateLimit(10);
  const limit2 = validateLimit(1_002);

  console.log(limit1, limit2);
}

main();
