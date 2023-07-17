function test2(array: string[] | number[]) {
  return array.filter((item) => {
    return true;
  });
}

type Tuple1 = [a: number, ...number[]];
type Tuple5 = [a: number, string];
type Tuple2 = [a: number, ...rest: number[]];

type Tuple3 = [a: number, b: string];
type Tuple4 = [number, string];

type MergedTuple = [...Tuple3, ...Tuple4];
//    ^?

const test: { asdf?: number; foo?: number } = {};
