import { useRef, useCallback } from "react";
import { useUniversalRef } from "./use-universal-ref";

export function useResizeObserver(onResize: ResizeObserverCallback) {
  const roRef = useRef<ResizeObserver | null>(null);

  const attachResizeObserver = useCallback(
    (element: HTMLElement) => {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(element);
      roRef.current = resizeObserver;
    },
    [onResize]
  );

  const detachResizeObserver = useCallback(() => {
    roRef.current?.disconnect();
  }, []);

  const refCb = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        attachResizeObserver(element);
      } else {
        detachResizeObserver();
      }
    },
    [attachResizeObserver, detachResizeObserver]
  );

  return useUniversalRef(refCb);
}
