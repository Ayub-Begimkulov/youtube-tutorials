interface Signal<Value> {
  value: Value;
}

interface ComputedSignal<Value> {
  readonly value: Value;
}

interface EffectCb {
  (): void;
  isActive: boolean;
  isRunning: boolean;
  deps: SignalImpl<unknown>[];
}

let runningEffect: EffectCb | null = null;

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

  set value(newValue: Value) {
    if (Object.is(newValue, this.savedValue)) {
      return;
    }
    this.savedValue = newValue;
    this.runDependencies();
  }

  protected addDependency() {
    if (!runningEffect) {
      return;
    }

    this.deps.add(runningEffect);
    runningEffect.deps.push(this);
  }

  protected runDependencies() {
    const depsToRun = [...this.deps];
    depsToRun.forEach((cb) => cb());
  }

  removeDependency(effectCb: EffectCb) {
    this.deps.delete(effectCb);
  }
}

export function signal<Value>(initialValue: Value): Signal<Value> {
  return new SignalImpl(initialValue);
}

export function effect(cb: VoidFunction) {
  const effectCb: EffectCb = () => {
    if (effectCb.isRunning || !effectCb.isActive) {
      return;
    }

    effectCb.deps.forEach((signal) => signal.removeDependency(effectCb));

    effectCb.isRunning = true;
    const prevRunningEffect = runningEffect;
    runningEffect = effectCb;

    try {
      cb();
    } catch (e) {
      console.error(
        "an error happened inside effect, you code might work not as expected"
      );
      throw e;
    } finally {
      runningEffect = prevRunningEffect;
      effectCb.isRunning = false;
    }
  };

  effectCb.deps = [];
  effectCb.isRunning = false;
  effectCb.isActive = true;

  effectCb();

  return () => {
    effectCb.isActive = false;
    effectCb.deps.forEach((signal) => signal.removeDependency(effectCb));
    effectCb.deps.length = 0;
  };
}

class ComputedSignalImpl<Value> extends SignalImpl<Value> {
  private compute: () => Value;
  private isDirty = true;
  private disposeEffect: VoidFunction | null = null;

  constructor(compute: () => Value) {
    super(undefined as Value);
    this.compute = compute;
  }

  override get value() {
    if (this.isDirty) {
      this.updateValueInEffect();
    }
    this.addDependency();
    return this.savedValue;
  }

  private updateValueInEffect() {
    this.disposeEffect = effect(() => {
      if (this.isDirty) {
        this.savedValue = this.compute();
        this.isDirty = false;
      } else {
        this.isDirty = true;
        this.disposeEffect?.();
        this.runDependencies();
      }
    });
  }
}

export function computed<Value>(compute: () => Value): ComputedSignal<Value> {
  return new ComputedSignalImpl(compute);
}
