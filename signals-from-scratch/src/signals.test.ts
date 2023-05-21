import { signal, effect, computed } from "./solution";

describe("effect", () => {
  it("should run effects when data changes", () => {
    let dummy;
    const num = signal(0);
    const spy = jest.fn(() => (dummy = num.value));

    effect(spy);

    expect(spy).toBeCalledTimes(1);
    expect(dummy).toBe(0);

    for (let i = 0; i < 10; i++) {
      num.value++;
    }

    expect(spy).toBeCalledTimes(11);
    expect(dummy).toBe(10);
  });

  it("should observe multiple signals", () => {
    let dummy;
    const num1 = signal(1);
    const num2 = signal(1);

    effect(() => (dummy = num1.value + num2.value));

    expect(dummy).toBe(2);

    num1.value = 7;

    expect(dummy).toBe(8);

    num2.value = 5;

    expect(dummy).toBe(12);
  });

  it("should handle multiple effects", () => {
    let dummy1, dummy2;
    const num = signal(0);

    effect(() => (dummy1 = num.value));
    effect(() => (dummy2 = num.value));

    expect(dummy1).toBe(0);
    expect(dummy2).toBe(0);

    num.value = 7;

    expect(dummy1).toBe(7);
    expect(dummy2).toBe(7);
  });

  it("should observe function chain calls", () => {
    let dummy;
    const num = signal(0);

    const getDummy = () => num.value;

    effect(() => {
      dummy = getDummy();
    });

    expect(dummy).toBe(0);

    num.value = 5;

    expect(dummy).toBe(5);
  });

  it("should avoid implicit infinite recursive loops with itself", () => {
    const num = signal(0);

    const spy = jest.fn(() => num.value++);
    effect(spy);

    expect(num.value).toBe(1);
    expect(spy).toBeCalledTimes(1);

    num.value = 4;
    expect(num.value).toBe(5);
    expect(spy).toBeCalledTimes(2);
  });

  it("should avoid infinite loops with other reactions", () => {
    const num1 = signal(0);
    const num2 = signal(1);

    const spy1 = jest.fn(() => (num1.value = num2.value));
    const spy2 = jest.fn(() => (num2.value = num1.value));

    effect(spy1);
    effect(spy2);

    expect(num1.value).toBe(1);
    expect(num2.value).toBe(1);

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);

    num2.value = 4;

    expect(num1.value).toBe(4);
    expect(num2.value).toBe(4);

    expect(spy1).toBeCalledTimes(2);
    expect(spy2).toBeCalledTimes(2);

    num1.value = 10;

    expect(num1.value).toBe(10);
    expect(num2.value).toBe(10);

    expect(spy1).toBeCalledTimes(3);
    expect(spy2).toBeCalledTimes(3);
  });

  it("should continue adding dependencies after recursion", () => {
    const num1 = signal(0);
    const num2 = signal(1);
    const num3 = signal(0);

    const spy1 = jest.fn(() => {
      num1.value = num2.value * 2;
    });
    const spy2 = jest.fn(() => {
      num2.value = num1.value * 2;
      num3.value;
    });

    effect(spy1);
    effect(spy2);

    expect(num1.value).toBe(8);
    expect(num2.value).toBe(4);

    expect(spy1).toBeCalledTimes(2);
    expect(spy2).toBeCalledTimes(1);

    num3.value = 10;

    expect(spy1).toBeCalledTimes(3);
    expect(spy2).toBeCalledTimes(2);
  });

  it("should discover new branches while running automatically", () => {
    const num1 = signal(0);
    const num2 = signal(0);

    const spy1 = jest.fn();
    const spy2 = jest.fn();

    effect(() => {
      if (num1.value < 2) {
        spy1();
      } else if (num2.value >= 0) {
        spy2();
      }
    });

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(0);

    num1.value = 2;

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);

    num2.value = 5;

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(2);
  });

  it("should not be triggered by mutating a property, which is used in an inactive branch", () => {
    let dummy;
    const shouldRun = signal(true);
    const string = signal("value");

    const conditionalSpy = jest.fn(() => {
      dummy = shouldRun.value ? string.value : "other";
    });
    effect(conditionalSpy);

    expect(dummy).toBe("value");
    expect(conditionalSpy).toBeCalledTimes(1);

    shouldRun.value = false;
    expect(dummy).toBe("other");
    expect(conditionalSpy).toBeCalledTimes(2);

    string.value = "value2";
    expect(dummy).toBe("other");
    expect(conditionalSpy).toBeCalledTimes(2);
  });

  it("should not run if the value didn't change", () => {
    let dummy;
    const num = signal(0);

    const spy = jest.fn(() => {
      dummy = num.value;
    });
    effect(spy);

    expect(dummy).toBe(0);
    expect(spy).toBeCalledTimes(1);

    num.value = 2;

    expect(dummy).toBe(2);
    expect(spy).toBeCalledTimes(2);

    num.value = 2;

    expect(dummy).toBe(2);
    expect(spy).toBeCalledTimes(2);
  });
});

describe("computed", () => {
  it("should return updated value", () => {
    const num = signal(0);
    const cNum = computed(() => num.value);
    expect(cNum.value).toBe(0);
    num.value = 1;
    expect(cNum.value).toBe(1);
  });

  it("should compute lazily", () => {
    const num = signal(-1);
    const getter = jest.fn(() => num.value);
    const cNum = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cNum.value).toBe(-1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cNum.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    num.value = 1;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cNum.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cNum.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });

  it("should trigger effect", () => {
    const num = signal(-1);
    const cNum = computed(() => {
      return num.value;
    });
    let dummy;
    effect(() => {
      dummy = cNum.value;
    });
    expect(dummy).toBe(-1);
    num.value = 1;
    expect(dummy).toBe(1);
  });

  it("should work when chained", () => {
    const num = signal(0);
    const c1 = computed(() => num.value);
    const c2 = computed(() => c1.value + 1);
    expect(c2.value).toBe(1);
    expect(c1.value).toBe(0);
    num.value++;
    expect(c2.value).toBe(2);
    expect(c1.value).toBe(1);
  });

  it("should trigger effect when chained", () => {
    const num = signal(0);
    const getter1 = jest.fn(() => num.value);
    const getter2 = jest.fn(() => {
      return c1.value + 1;
    });
    const c1 = computed(getter1);
    const c2 = computed(getter2);

    let dummy;
    effect(() => {
      dummy = c2.value;
    });
    expect(dummy).toBe(1);
    expect(getter1).toHaveBeenCalledTimes(1);
    expect(getter2).toHaveBeenCalledTimes(1);
    num.value++;
    expect(dummy).toBe(2);
    // should not result in duplicate calls
    expect(getter1).toHaveBeenCalledTimes(2);
    expect(getter2).toHaveBeenCalledTimes(2);
  });

  it("should trigger effect when chained (mixed invocations)", () => {
    const num = signal(0);
    const getter1 = jest.fn(() => num.value);
    const getter2 = jest.fn(() => {
      return c1.value + 1;
    });
    const c1 = computed(getter1);
    const c2 = computed(getter2);

    let dummy;
    effect(() => {
      dummy = c1.value + c2.value;
    });
    expect(dummy).toBe(1);

    expect(getter1).toHaveBeenCalledTimes(1);
    expect(getter2).toHaveBeenCalledTimes(1);
    num.value++;
    expect(dummy).toBe(3);
    // should not result in duplicate calls
    expect(getter1).toHaveBeenCalledTimes(2);
    expect(getter2).toHaveBeenCalledTimes(2);
  });
});
