export {};

type MyReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
type MyWritable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

type TestReadonlyObject = MyReadonly<{ a: number }>;
//   ^?
type TestReadonlyArray = MyReadonly<number[]>;
//   ^?

type TestWritableObject = MyWritable<{ readonly a: number }>;
//   ^?
type TestWritableArray = MyWritable<readonly number[]>;
//   ^?

declare const test: TestReadonlyArray &
  TestReadonlyObject &
  TestWritableArray &
  TestWritableObject;
