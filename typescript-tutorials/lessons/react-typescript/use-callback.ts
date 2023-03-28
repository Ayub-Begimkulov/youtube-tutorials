import { useCallback } from "react";

const cb = useCallback((arg1, arg2, arg3) => {
  //                    ^^^^  ^^^^  ^^^^
  // Parameter 'arg1' implicitly has an 'any' type.ts(7006)
  arg1;
  // ^?
  arg2;
  // ^?
  arg3;
  // ^?
}, []);

cb(1, 2, 3);

// function useCallback<T extends Function>(
//   callback: T,
//   deps: DependencyList
// ): T;

// function useCallback(...args: any[]): any {
//   return "asdf";
// }
