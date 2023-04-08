import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const eventCb = useCallback(
    (...args: Parameters<T>) => {
      return fnRef.current.apply(null, args);
    },
    [fnRef]
  );

  return eventCb;
}
