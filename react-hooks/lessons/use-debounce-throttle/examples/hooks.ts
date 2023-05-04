import { useEffect, useMemo } from "react";
import { debounce, rafThrottle } from "../utils";
import { useEvent } from "../../use-ref/slides/use-event";

export function useDebounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  ms: number
) {
  const memoizedFn = useEvent(fn);

  const debouncedFn = useMemo(
    () =>
      debounce((...args: Parameters<Fn>) => {
        memoizedFn(...args);
      }, ms),
    [ms]
  );

  useEffect(
    () => () => {
      debouncedFn.cancel();
    },
    [debouncedFn]
  );

  return debouncedFn;
}

export function useRafThrottle<Fn extends (...args: any[]) => any>(fn: Fn) {
  const memoizedFn = useEvent(fn);

  const throttledFn = useMemo(
    () =>
      rafThrottle((...args: Parameters<Fn>) => {
        memoizedFn(...args);
      }),
    []
  );

  useEffect(
    () => () => {
      throttledFn.cancel();
    },
    [throttledFn]
  );

  return throttledFn;
}
