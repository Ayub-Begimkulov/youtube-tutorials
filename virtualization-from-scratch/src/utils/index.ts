import { useEffect, useInsertionEffect, useMemo, useRef } from "react";

export function rafThrottle<Fn extends (...args: any[]) => any>(cb: Fn) {
  let rafId: number | null = null;
  let latestArgs: Parameters<Fn>;

  return function throttled(...args: Parameters<Fn>) {
    latestArgs = args;

    if (typeof rafId === "number") {
      return;
    }

    rafId = requestAnimationFrame(() => {
      cb(...latestArgs);
    });
  };
}

export function useResizeObserver(cb: ResizeObserverCallback) {
  const latestCb = useRef(cb);

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entires, observer) => {
        latestCb.current(entires, observer);
      }),
    []
  );

  useEffect(() => () => resizeObserver.disconnect(), []);

  return resizeObserver;
}

export function useLatest<T>(value: T) {
  const latestValue = useRef(value);

  useInsertionEffect(() => {
    latestValue.current = value;
  }, []);

  return latestValue;
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

let rafScheduled = false;
const tasks: (() => void)[] = [];

export function scheduleDOMUpdate(cb: () => void) {
  tasks.push(cb);
  if (rafScheduled) {
    return;
  }
  rafScheduled = true;
  requestAnimationFrame(() => {
    const tasksToRun = tasks.slice();
    tasks.length = 0;
    tasksToRun.forEach((task) => task());
    rafScheduled = false;
  });
}
