export {};

type AddNull<T> = {
  [Key in keyof T]: T[Key] | null;
};

type Test = AddNull<{ a: number } | { b: string }>;
//   ^?

declare const test: Test;
