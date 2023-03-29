import { /* DependencyList, */ useCallback } from "react";

const cb = useCallback((arg1, arg2, arg3) => {
  arg1;
  // ^?
  arg2;
  // ^?
  arg3;
  // ^?
}, []);

cb(1, 2, 3);

// function useCallback<T extends (...args: any[]) => any>(
//   callback: T,
//   deps: DependencyList
// ): T;

// function useCallback(...args: any[]): any {
//   return "asdf";
// }
