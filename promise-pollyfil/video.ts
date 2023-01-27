import { isPromiseLike } from "./utils";

type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void;

type AnyFunction = (...args: any[]) => any;
type Resolve<T> = (value: T) => void;
type Reject = (reason?: any) => void;

type Status = "fulfilled" | "rejected" | "pending";

class MyPromise<T> {
  thenCbs: [
    AnyFunction | undefined,
    AnyFunction | undefined,
    Resolve<T>,
    Reject
  ][] = [];
  status: Status = "pending";
  value: T | null = null;
  error?: any;

  constructor(initializer: Initializer<T>) {
    initializer(this.resolve, this.reject);
  }

  then = (thenCb?: (value: T) => void, catchCb?: (reason?: any) => void) => {
    return new MyPromise((resolve, reject) => {
      this.thenCbs.push([thenCb, catchCb, resolve, reject]);
    });
  };

  catch = (catchCb?: (reason?: any) => void) => {
    return new MyPromise((resolve, reject) => {
      this.thenCbs.push([undefined, catchCb, resolve, reject]);
    });
  };

  private resolve = (value: T | PromiseLike<T>) => {
    if (isPromiseLike(value)) {
      value.then(this.resolve, this.reject);
    } else {
      this.status = "fulfilled";
      this.value = value;

      this.processNextTasks();
    }
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

    const thenCbs = this.thenCbs;
    this.thenCbs = [];

    thenCbs.forEach(([thenCb, catchCb, resolve]) => {
      if (this.status === "fulfilled") {
        const value = thenCb ? thenCb(this.value) : this.value;
        resolve(value);
      } else {
        const reason = catchCb ? catchCb(this.error) : this.error;
        resolve(reason);
      }
    });

    // if (this.status === "fulfilled") {
    //   const thenCbs = this.thenCbs;
    //   this.thenCbs = [];

    //   thenCbs.forEach(([thenCb, catchCb, resolve, reject]) => {
    //     const value = thenCb ? thenCb(this.value) : this.value;
    //     resolve(value);
    //   });
    // } else {
    //   const catchCbs = this.thenCbs;
    //   this.thenCbs = [];

    //   thenCbs.forEach(([thenCb, catchCb, resolve, reject]) => {
    //     const value = catchCb(this.value);
    //     reject(value);
    //   });
    // }
  };
}

// const sleep = (ms: number) => {
//   return new MyPromise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });
// };

const promise = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    reject(5);
  }, 500);
}).then(
  (value) => {
    console.log("value:", value);
  },
  (value) => {
    console.log("second", value);
  }
);

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
