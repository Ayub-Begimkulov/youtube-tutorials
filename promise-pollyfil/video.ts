type Initializer<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

type AnyFunction = (...args: any[]) => any;

class MyPromise<T> {
  thenCb: AnyFunction | null = null;
  catchCb: AnyFunction | null = null;

  constructor(initializer: Initializer<T>) {
    initializer(this.resolve, this.reject);
  }

  then = (thenCb: (value: T) => void) => {
    this.thenCb = thenCb;

    return this;
  };

  catch = (catchCb: (reason?: any) => void) => {
    this.catchCb = catchCb;

    return this;
  };

  private resolve = (value: T) => {
    this.thenCb?.(value);
  };

  private reject = (reason?: any) => {
    this.catchCb?.(reason);
  };
}

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

// const promise = new Promise<number>(() => {
//   setTimeout(() => {
//     resolve(5);
//   }, 500);
// }).then(() => sleep(5000)).catch(error => {
//     console.log('error:'error)
// });

// const promise = new MyPromise<number>((resolve, _reject) => {
//   setTimeout(() => {
//     resolve(5);
//   }, 1_000);
// })
//   .then((value) => {
//     console.log("value:", value);
//   })
//   .catch((error) => {
//     console.error("error:", error);
//   });
