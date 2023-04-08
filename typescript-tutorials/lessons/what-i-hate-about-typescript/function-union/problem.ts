export {};

type MyFnType = ((val: number) => void) | ((val: string) => void);

let myFn: MyFnType = (arg) => {
  //                    ^?
  // Parameter 'arg' implicitly has an 'any' type.ts(7006)
};

myFn();
