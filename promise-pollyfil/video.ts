import { isPromiseLike, asap } from "./utils";

type Initializer<T> = (resolve: Resolve, reject: Reject) => void;

type Resolve = (value: any) => void;
type Reject = (reason?: any) => void;

type ThenCb<T> = (value: T) => any;
type CatchCb = (reason?: any) => any;

type AllSettledResult<T> =
  | {
      status: "fulfilled";
      value: T;
    }
  | {
      status: "rejected";
      reason: any;
    };

type Status = "fulfilled" | "rejected" | "pending";

class MyPromise<T> {
  thenCbs: [ThenCb<T> | undefined, CatchCb | undefined, Resolve, Reject][] = [];
  status: Status = "pending";
  value: T | null = null;
  error?: any;

  constructor(initializer: Initializer<T>) {
    try {
      initializer(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  static all<U>(promises: (U | MyPromise<U>)[]) {
    const result: U[] = Array(promises.length);
    let count = 0;

    return new MyPromise<U[]>((resolve, reject) => {
      promises.forEach((p, index) => {
        MyPromise.resolve(p)
          .then((value) => {
            result[index] = value;
            count++;

            if (count === promises.length) {
              resolve(result);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }

  static allSettled<U>(promises: MyPromise<U>[]) {
    return MyPromise.all<AllSettledResult<U>>(
      promises.map((p) =>
        p
          .then((value) => ({ status: "fulfilled" as const, value }))
          .catch((reason) => ({ status: "rejected" as const, reason }))
      )
    );
  }

  static race<U>(promises: MyPromise<U>[]) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        MyPromise.resolve(p).then(resolve).catch(reject);
      });
    });
  }

  static resolve<U>(value: U | PromiseLike<U>) {
    return new MyPromise<U>((resolve) => {
      resolve(value);
    });
  }

  static reject(reason?: any) {
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }

  then = <U>(
    thenCb?: (value: T) => U | PromiseLike<U>,
    catchCb?: (reason?: any) => void
  ) => {
    const promise = new MyPromise<U>((resolve, reject) => {
      this.thenCbs.push([thenCb, catchCb, resolve, reject]);
    });

    this.processNextTasks();

    return promise;
  };

  catch = <U>(catchCb?: (reason?: any) => U) => {
    const promise = new MyPromise<U>((resolve, reject) => {
      this.thenCbs.push([undefined, catchCb, resolve, reject]);
    });

    this.processNextTasks();

    return promise;
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
    asap(() => {
      if (this.status === "pending") {
        return;
      }

      const thenCbs = this.thenCbs;
      this.thenCbs = [];

      thenCbs.forEach(([thenCb, catchCb, resolve, reject]) => {
        try {
          if (this.status === "fulfilled") {
            const value = thenCb ? thenCb(this.value) : this.value;
            resolve(value);
          } else {
            if (catchCb) {
              const value = catchCb(this.error);
              resolve(value);
            } else {
              reject(this.error);
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };
}

const promise = new MyPromise<number>((resolve) => {
  resolve(5);
})
  .then((value) => {
    console.log(value); // 5

    throw new Error("error");
  })
  .then(() => {
    console.log("asdf");
  })
  .then((v) => {
    console.log("test");
    return "asdf";
  })
  .catch((error) => {
    console.error("=======", error);
  })
  .then(() => {
    return new MyPromise((resolve) => {
      resolve(5);
    });
  })
  .then(console.log); // 5
