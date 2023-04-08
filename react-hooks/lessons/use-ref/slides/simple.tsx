import { useEffect, useRef } from "react";

export function Simple() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(ref);
  }, []);

  return <div ref={ref}>I'm a div</div>;
}
