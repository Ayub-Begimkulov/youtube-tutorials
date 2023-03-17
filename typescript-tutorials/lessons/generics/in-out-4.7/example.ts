export {};

class Base {
  a = 10;
}

class Specific extends Base {
  b = 10;
}

type Getter<T> = () => T;
type Setter<T> = (value: T) => void;
