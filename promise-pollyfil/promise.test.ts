import { MyPromise } from "./solution";

function sleep(ms: number = 0) {
  return new Promise<undefined>((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}

describe("MyPromise", () => {
  it("then", async () => {
    let value: number | null = null;

    new MyPromise<number>((resolve) => {
      setTimeout(() => {
        resolve(5);
      }, 10);
    }).then((pValue) => {
      value = pValue;
    });

    await sleep(11);

    expect(value).toBe(5);
  });

  it("catch", async () => {
    let value: number | null = null;

    new MyPromise<number>((_, reject) => {
      setTimeout(() => {
        reject(5);
      }, 10);
    }).catch((pValue) => {
      value = pValue;
    });

    await sleep(11);

    expect(value).toBe(5);
  });
});
