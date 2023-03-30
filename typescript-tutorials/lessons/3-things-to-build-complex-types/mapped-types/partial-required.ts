export {};

type MyPartial<T> = {
  [Key in keyof T]?: T[Key];
};

type TestPartialObject = MyPartial<{ a: number }>;
//   ^?
type TestPartialArray = MyPartial<number[]>;
//   ^?

type MyRequired<T> = {
  [Key in keyof T]-?: T[Key];
};

type TestRequiredObject = MyRequired<{ a?: number | undefined }>;
//   ^?
type TestRequiredArray = MyRequired<(number | undefined)[]>;
//   ^?

declare const testPartial: TestPartialObject &
  TestPartialArray &
  TestRequiredObject &
  TestRequiredArray;
