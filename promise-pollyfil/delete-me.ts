export {};

type VoidFn = () => void;

class MyPromise<T> {
  private callbacks: any[] = [];

  constructor(
    initializer: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    try {
      initializer(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  private resolve = (value: T | PromiseLike<T>) => {
    this.callbacks.forEach(({ resolve, onResolve }) => {});
  };

  private reject = (reason?: any) => {
    this.catchCbs.forEach((cb) => {
      cb(reason);
    });
  };

  then = (
    onResolve?: (value: T | PromiseLike<T>) => void,
    onReject?: (reason?: any) => void
  ) => {
    return new MyPromise((resolve, reject) => {
      this.callbacks.push({
        resolve,
        reject,
        onReject,
        onResolve,
      });
    });
  };

  catch = (onReject?: (reason?: any) => void) => {
    return new MyPromise((resolve, reject) => {
      this.callbacks.push({
        resolve,
        reject,
        onReject,
      });
    });
  };
}

const promise = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve("asdf");
  }, 500);
});

promise
  .then(() => {
    console.log("asdfasdf");
  })
  .then(() => {
    console.log("asdfasdf2");
  })
  .catch(console.error);

declare function getNum(key: "a" | "b" | "c"): Promise<number>;

async function sum() {
  const a = await getNum("a");
  const b = await getNum("b");
  const c = await getNum("c");

  return a + b + c;
}

async function sum2() {
  const [a, b, c] = await Promise.all([getNum("a"), getNum("b"), getNum("c")]);

  return a + b + c;
}
