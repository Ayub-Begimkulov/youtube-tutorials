export {};

type ObjectEntries<T> = {
  [Key in keyof T]: [Key, T[Key]];
}[keyof T];

type Test = ObjectEntries<{ a: number; b: string; c: undefined }>;
//   ^?

type EntriesObject<T> = {
  [Key in keyof T]: [Key, T[Key]];
};

type EO = EntriesObject<{ a: number; b: string; c: undefined }>;
// type EO = {
//   a: ["a", number];
//   b: ["b", string];
//   c: ["c", undefined];
// }

declare const test: Test & EO;
