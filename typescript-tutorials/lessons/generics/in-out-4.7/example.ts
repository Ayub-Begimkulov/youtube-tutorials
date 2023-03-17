export {};

class Base {
  a = 10;
}

class Specific extends Base {
  b = 10;
}

type Getter<out T> = () => T;
type Setter<in T> = (value: T) => void;

interface GetterAndSetter<in out T> {
  get: () => T;
  set: (value: T) => void;
}

type BaseGetter = Getter<Base>;
type SpecificGetter = Getter<Specific>;

declare let baseGetter: BaseGetter;
declare let specificGetter: SpecificGetter;

// type Test = Base extends Specific ? true : false

baseGetter = specificGetter;
specificGetter = baseGetter;

// ============

type BaseSetter = Setter<Base>;
type SpecificSetter = Setter<Specific>;

declare let baseSetter: BaseSetter;
declare let specificSetter: SpecificSetter;

// type Test = Specific extends Base ? true : false

baseSetter = specificSetter;
specificSetter = baseSetter;
