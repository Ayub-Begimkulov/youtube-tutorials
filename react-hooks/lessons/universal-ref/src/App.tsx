import { useState, useCallback, useRef, useEffect } from "react";
import { useResizeObserver } from "./hooks/use-resize-observer";

export function App() {
  const [bool, setBool] = useState(false);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    console.log("resize", entries);
  }, []);

  const resizeRef = useResizeObserver(handleResize);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(elementRef.current);
  }, [bool]);

  const renderTestText = () => {
    if (bool) {
      return <article ref={resizeRef(elementRef)}>Test Article</article>;
    }

    return <div ref={resizeRef(elementRef)}>Test Div</div>;
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <button onClick={() => setBool((v) => !v)}>Toggle</button>
      {renderTestText()}
    </div>
  );
}
