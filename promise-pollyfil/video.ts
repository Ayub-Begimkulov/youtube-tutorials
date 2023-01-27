type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void;

type AnyFunction = (...args: any[]) => any;
type Resolve<T> = (value: T) => void;
type Reject = (reason?: any) => void;

type Status = "fulfilled" | "rejected" | "pending";

class MyPromise<T> {
  thenCbs: [AnyFunction, Resolve<T>][] = [];
  catchCbs: [AnyFunction, Reject][] = [];
  status: Status = "pending";
  value: T | null = null;
  error?: any;

  constructor(initializer: Initializer<T>) {
    initializer(this.resolve, this.reject);
  }

  then = (thenCb: (value: T) => void) => {
    return new MyPromise((resolve, reject) => {
      this.thenCbs.push([thenCb, resolve]);
    });
  };

  catch = (catchCb: (reason?: any) => void) => {
    return new MyPromise((resolve, reject) => {
      this.catchCbs.push([catchCb, reject]);
    });
  };

  private resolve = (value: T) => {
    this.status = "fulfilled";
    this.value = value;

    this.processNextTasks();
  };

  private reject = (reason?: any) => {
    this.status = "rejected";
    this.error = reason;

    this.processNextTasks();
  };

  private processNextTasks = () => {
    if (this.status === "pending") {
      return;
    }

    if (this.status === "fulfilled") {
      const thenCbs = this.thenCbs;
      this.thenCbs = [];

      thenCbs.forEach(([thenCb, resolve]) => {
        const value = thenCb(this.value);
        resolve(value);
      });
    } else {
      const catchCbs = this.catchCbs;
      this.catchCbs = [];

      catchCbs.forEach(([catchCb, reject]) => {
        const value = catchCb(this.value);
        reject(value);
      });
    }
  };
}

const sleep = (ms: number) => {
  return new MyPromise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const promise = new MyPromise<number>((resolve) => {
  setTimeout(() => {
    resolve(5);
  }, 500);
})
  .then((value) => {
    console.log("value:", value);
    return sleep(5_000);
  })
  .then(() => {
    console.log("===========");
  });

// const promise = new Promise<number>((resolve) => {
//   setTimeout(() => {
//     resolve(5);
//   }, 1);
// })
//   .then((value) => {
//     console.log("value:", value);
//     return sleep(5000);
//   })
//   .then(() => console.log("========"))
//   .catch((error) => {
//     console.log("error:", error);
//   });

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
