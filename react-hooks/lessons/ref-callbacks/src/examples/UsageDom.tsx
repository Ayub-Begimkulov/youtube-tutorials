import { useCallback, useEffect, useRef, useState } from "react";

interface ResizeObserverOptions {
  elementRef: React.RefObject<HTMLElement>;
  onResize: ResizeObserverCallback;
}

function useResizeObserverOld({ elementRef, onResize }: ResizeObserverOptions) {
  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(onResize);

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [onResize, elementRef]);
}

function useResizeObserver(onResize: ResizeObserverCallback) {
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

  return refCb;
}

export function UsageDom() {
  const [bool, setBool] = useState(false);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    console.log("resize", entries);
  }, []);

  const resizeRef = useResizeObserver(handleResize);

  const renderTestText = () => {
    if (bool) {
      return <article ref={resizeRef}>Test Article</article>;
    }

    return <div ref={resizeRef}>Test Div</div>;
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <button onClick={() => setBool((v) => !v)}>Toggle</button>
      {renderTestText()}
    </div>
  );
}
