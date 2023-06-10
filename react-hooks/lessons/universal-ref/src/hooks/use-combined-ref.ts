import { useCallback } from "react";

type RefItem<T> =
  | ((element: T | null) => void)
  | React.MutableRefObject<T | null>
  | null
  | undefined;

export function useCombinedRef<T>(...refs: RefItem<T>[]) {
  const refCb = useCallback((element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element;
      }
    });
  }, refs);

  return refCb;
}
