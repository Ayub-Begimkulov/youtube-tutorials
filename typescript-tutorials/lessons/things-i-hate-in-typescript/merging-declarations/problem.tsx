// https://www.typescriptlang.org/docs/handbook/declaration-merging.html

export {};

type Test = Array<number>;

interface Lesson {
  membersCount: number;
  price: number;
}

let obj: Lesson = {
  membersCount: 5,
  price: 100,
};

interface Comment {
  id: number;
  text: string;
}

const comment: Comment = {
  id: 5,
  text: "good video!",
};

interface MyTestClass {
  test: number;
}

class MyTestClass {
  a = 5;

  method() {
    return this.a;
  }
}

const instance = new MyTestClass();

instance.test;
