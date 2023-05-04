import { useEffect, useMemo } from "react";
import { debounce, rafThrottle } from "../utils";
import { useEvent } from "../../use-ref/slides/use-event";

// ======================
// JUST FOR FUNC
// BETTER TO USE SEPARATE HOOKS FOR EACH CASE
// ======================

type AnyFunction = (...args: any[]) => any;
type Tail<Arr extends readonly unknown[]> = Arr extends readonly [
  unknown,
  ...infer Rest
]
  ? Rest
  : never;

type DebounceResult<T extends AnyFunction> = T & { cancel(): void };

type DebounceFn = (
  fn: AnyFunction,
  ...params: any[]
) => DebounceResult<AnyFunction>;

function createDebounceHook<DFn extends DebounceFn>(debounceFn: DFn) {
  return function useDebounce<Fn extends AnyFunction>(
    fn: Fn,
    ...debounceParams: Tail<Parameters<DFn>>
  ): DebounceResult<(...args: Parameters<Fn>) => void> {
    const memoizedFn = useEvent(fn);

    const debouncedFn = useMemo(
      () =>
        debounceFn((...args: Parameters<Fn>) => {
          memoizedFn(...args);
        }, ...debounceParams),
      [...debounceParams]
    );

    useEffect(
      () => () => {
        debouncedFn.cancel();
      },
      [debouncedFn]
    );

    return debouncedFn;
  };
}

export const useDebounce = createDebounceHook(debounce);
export const useRafThrottle = createDebounceHook(rafThrottle);
