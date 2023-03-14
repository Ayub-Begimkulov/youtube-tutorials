export {};

function test(arg: any) {
  console.log(arg + 5);
  console.log(arg.charCodeAt(0));
  console.log(arg.concat([1, 2, 3]));
  console.log({ ...arg });
}

test(1);
