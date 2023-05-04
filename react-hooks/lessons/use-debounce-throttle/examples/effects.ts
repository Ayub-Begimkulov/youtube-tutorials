import { useEffect, useRef } from "react";
import { useDebounce } from "./hooks";

export function useDebounceEffect(
  cb: React.EffectCallback,
  deps: React.DependencyList,
  ms: number
) {
  const cleanUp = useRef<(() => void) | void>();
  const effectCb = useDebounce(() => {
    cleanUp.current = cb();
  }, ms);

  useEffect(() => {
    effectCb();

    return () => {
      if (typeof cleanUp.current === "undefined") {
        return;
      }
      cleanUp.current();
      cleanUp.current = undefined;
    };
  }, deps);
}
