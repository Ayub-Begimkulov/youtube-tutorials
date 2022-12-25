import { asap, isPromiseLike } from "./utils";

export class MyPromise<T> {
  private status: "pending" | "reolved" | "rejected" = "pending";
  private thenFns: any[] = [];
  private error: any = undefined;
  private value: T | undefined = undefined;

  constructor(
    initializer: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (value: any) => void
    ) => void
  ) {
    try {
      initializer(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  then = (onResolve?: (value: T) => void, onReject?: (error: any) => void) => {
    const promise = new MyPromise<T>((reolve, reject) => {
      this.thenFns.push({
        onResolve,
        onReject,
        reolve,
        reject,
      });
    });

    this.processNextTasks();

    return promise;
  };

  catch = (onReject) => {
    const promise = new MyPromise<T>((reolve, reject) => {
      this.thenFns.push({
        onResolve: undefined,
        onReject,
        reolve,
        reject,
      });
    });

    this.processNextTasks();

    return promise;
  };

  private resolve = (value?: PromiseLike<T> | T) => {
    if (isPromiseLike(value)) {
      value.then(this.resolve, this.reject);
    } else {
      this.status = "reolved";
      this.value = value;

      this.processNextTasks();
    }
  };

  private reject = (error: any) => {
    this.status = "rejected";
    this.error = error;

    this.processNextTasks();
  };

  private processNextTasks = () => {
    asap(() => {
      if (this.status === "pending") {
        return;
      }

      const thenFns = this.thenFns;

      thenFns.forEach(() => {
        const first = this.thenFns.shift();

        if (!first) {
          return;
        }

        const { resolve, reject, onResolve, onReject } = first;

        try {
          if (this.status === "reolved") {
            const value = onResolve ? onResolve(this.value) : this.value;

            if (value instanceof MyPromise) {
              promise.then(resolve).catch(reject);
            } else {
              resolve(value);
            }
          } else {
            const error = onReject ? onReject(this.error) : this.error;

            if (error instanceof Promise) {
              error.then(resolve).catch(resolve);
            }

            resolve(error);
          }
        } catch (error) {
          reject(error);
        }
      });

      this.thenFns = [];
    });
  };
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("asdf");
  }, 500);
})
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });
