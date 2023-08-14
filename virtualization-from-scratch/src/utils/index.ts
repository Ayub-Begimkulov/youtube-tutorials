import { useEffect, useMemo, useRef } from "react";

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
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entires, observer) => {
        cbRef.current(entires, observer);
      }),
    []
  );

  useEffect(() => () => resizeObserver.disconnect(), []);

  return resizeObserver;
}

// TODO what to do with this hook when using refs???
export function useLatest<T>(value: T) {
  const latestValue = useRef(value);

  // useLayoutEffect(() => {
  latestValue.current = value;
  // });

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
