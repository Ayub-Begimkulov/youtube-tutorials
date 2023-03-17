export {};

function withCharCodesWrong<T>(value: T) {
  const charCodes: number[] = [];

  for (let i = 0, l = value.length; i < l; i++) {
    //                      ^^^^^^
    // Property 'length' does not exist on type 'T'.ts(2339)
    charCodes.push(value.charCodeAt(i));
    //                   ^^^^^^^^^^
    // Property 'charCodeAt' does not exist on type 'T'.ts(2339)
  }

  return [value, charCodes] as const;
}

const [str, charCodes] = withCharCodesWrong("asdf" as const);
//     ^?
// should be error! but works...
withCharCodesWrong(["asdf", "test"]);

function withCharCodes<T extends string>(value: T) {
  const charCodes: number[] = [];

  for (let i = 0, l = value.length; i < l; i++) {
    charCodes.push(value.charCodeAt(i));
  }

  return [value, charCodes] as const;
}

withCharCodes("asdf");
withCharCodes(["asdf", "test"]);
//            ^^^^^^^^^^^^^^^^
// Argument of type 'string[]' is not assignable
// to parameter of type 'string'.ts(2345)

console.log(str, charCodes);
