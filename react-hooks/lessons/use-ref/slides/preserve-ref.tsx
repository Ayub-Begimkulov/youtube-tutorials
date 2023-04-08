import { useEffect, useReducer, useRef } from "react";

let previousRef: React.Ref<HTMLDivElement> | null = null;

export function PreserveRef() {
  const [, forceUpdate] = useReducer((v) => v + 1, 0);
  const ref = useRef<HTMLDivElement>(null);

  if (previousRef) {
    console.log("previousRef === ref", previousRef === ref);
  }

  previousRef = ref;

  useEffect(() => {
    console.log(ref);
  }, []);

  return (
    <>
      <div ref={ref}>I'm a div</div>
      <button onClick={forceUpdate}>Trigger Rerender</button>
    </>
  );
}
