export {};

type GenericType<T> = T & { name: string };
interface GenericInterface<T> {
  key: T;
  name: string;
}

const genericFunction = <T>(value: T) => value;
class GenericClass<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  setValue(newValue: T) {
    this.value = newValue;
  }
}

type Test1 = GenericType<{ a: string }>;
type Test2 = GenericInterface<number>;
genericFunction<number>(5);
genericFunction(5);
new GenericClass<number>(5);
new GenericClass(5);

declare const a: Test1 & Test2;
