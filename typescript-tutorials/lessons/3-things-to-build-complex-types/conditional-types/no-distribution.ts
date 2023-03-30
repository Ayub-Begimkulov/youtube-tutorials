export {};

type StringUnion = "asdf" | "test";

type StringBox<T> = T extends string ? { value: T } : never;

type Test = StringBox<StringUnion>;
//   ^?

type StringBoxUndistributed<T> = [T] extends [string] ? { value: T } : never;

type TestUndistributed = StringBoxUndistributed<StringUnion>;
//   ^?

declare const test: Test & TestUndistributed;
