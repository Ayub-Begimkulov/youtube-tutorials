import { useCallback, useEffect, useRef, useState } from "react";

interface ResizeObserverOptions {
  elementRef: React.RefObject<HTMLElement>;
  onResize: ResizeObserverCallback;
}

function useResizeObserver({ elementRef, onResize }: ResizeObserverOptions) {
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

export function UsageDom() {
  const [bool, setBool] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    console.log("resize", entries);
  }, []);

  useResizeObserver({
    elementRef,
    onResize: handleResize,
  });

  const renderTestText = () => {
    if (bool) {
      return <article ref={elementRef}>Test Article</article>;
    }

    return <div ref={elementRef}>Test Div</div>;
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <button onClick={() => setBool((v) => !v)}>Toggle</button>
      {renderTestText()}
    </div>
  );
}
