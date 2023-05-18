let runningEffect: EffectCb | null = null;

interface EffectCb {
  (): void;
  isRunning: boolean;
  isEffectCb: true;
  active: boolean;
  deps: SignalImpl<unknown>[];
}

interface Signal<Value> {
  value: Value;
}

interface ComputedSignal<Value> {
  readonly value: Value;
}

class SignalImpl<Value> implements Signal<Value> {
  protected savedValue: Value;
  private deps = new Set<EffectCb>();

  constructor(initialValue: Value) {
    this.savedValue = initialValue;
  }

  get value() {
    this.addDependency();
    return this.savedValue;
  }

  set value(newValue) {
    if (isEqual(this.savedValue, newValue)) {
      return;
    }

    this.savedValue = newValue;

    this.runDependencies();
  }

  addDependency() {
    if (!runningEffect) {
      return;
    }
    this.deps.add(runningEffect);
    runningEffect.deps.push(this);
  }

  runDependencies() {
    const depsToRun = new Set(this.deps);
    depsToRun.forEach((effectCb) => effectCb());
  }

  removeDependency(effectCb: EffectCb) {
    this.deps.delete(effectCb);
  }
}

export function signal<Value>(initialValue: Value): Signal<Value> {
  return new SignalImpl(initialValue);
}

export function effect(cb: VoidFunction) {
  const effectCb = isEffectCb(cb) ? cb : makeEffectCb(cb);

  effectCb();

  return () => {
    effectCb.active = false;
  };
}

function isEffectCb(cb: VoidFunction): cb is EffectCb {
  if ("isEffectCb" in cb && cb.isEffectCb === true) {
    return true;
  }

  return false;
}

export function makeEffectCb(cb: VoidFunction) {
  const effectCb: EffectCb = function effectCb() {
    if (!effectCb.active || effectCb.isRunning) {
      return;
    }

    const prevRunningEffect = runningEffect;

    try {
      effectCb.deps.forEach((signal) => signal.removeDependency(effectCb));
      effectCb.isRunning = true;
      runningEffect = effectCb;
      cb();
    } finally {
      runningEffect = prevRunningEffect;
      effectCb.isRunning = false;
    }
  };

  effectCb.isRunning = false;
  effectCb.isEffectCb = true;
  effectCb.active = true;
  effectCb.deps = [];

  return effectCb;
}

class ComputedSignalImpl<Value> extends SignalImpl<Value> {
  private getter: () => Value;
  private isDirty = true;
  private disposeEffect: VoidFunction | null = null;

  constructor(getter: () => Value) {
    super(undefined as Value);

    this.getter = getter;
  }

  override get value() {
    if (this.isDirty) {
      this.disposeEffect = effect(this.effectFn);
      this.isDirty = false;
    }

    this.addDependency();

    return this.savedValue;
  }

  private effectFn = () => {
    if (this.isDirty === false) {
      this.isDirty = true;
      this.runDependencies();
      this.disposeEffect?.();
    } else {
      this.savedValue = this.getter();
    }
  };
}

export function computed<Value>(getter: () => Value): ComputedSignal<Value> {
  return new ComputedSignalImpl(getter);
}

function isEqual(a: unknown, b: unknown) {
  return a === b || (a !== a && b !== b);
}
