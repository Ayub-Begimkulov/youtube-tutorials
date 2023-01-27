import { isPromiseLike, asap } from "./utils";

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
    try {
      initializer(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  then = (thenCb?: (value: T) => void, catchCb?: (reason?: any) => void) => {
    const promise = new MyPromise((resolve, reject) => {
      this.thenCbs.push([thenCb, catchCb, resolve, reject]);
    });

    this.processNextTasks();

    return promise;
  };

  catch = (catchCb?: (reason?: any) => void) => {
    const promise = new MyPromise((resolve, reject) => {
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
            const reason = catchCb ? catchCb(this.error) : this.error;
            resolve(reason);
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
    console.log(value);

    throw new Error("error");
  })
  .then(() => {
    console.log("asdf");
  })
  .catch((error) => {
    console.error("=======", error);
  })
  .then(() => {
    return new MyPromise((resolve) => {
      resolve(5);
    });
  })
  .then(console.log);
