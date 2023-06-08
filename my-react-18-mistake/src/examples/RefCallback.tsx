import { useCallback, useEffect, useReducer } from "react";
import { queueMacrotask } from "../utils";

export function RefCallback() {
  const [forceUpdateCount, forceUpdate] = useReducer((v) => v + 1, 0);
  const [count, increment] = useReducer((v) => v + 1, 0);

  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }
      queueMicrotask(() => {
        console.log("before update microtask");
      });
      queueMacrotask(() => {
        console.log("before update macrotask");
      });

      increment();

      queueMicrotask(() => {
        console.log("after update microtask");
      });
      queueMacrotask(() => {
        console.log("after update macrotask");
      });
    },
    [forceUpdateCount]
  );

  console.log("render");

  queueMicrotask(() => {
    console.log("before effect microtask");
  });
  queueMacrotask(() => {
    console.log("before effect macrotask");
  });

  useEffect(() => {
    console.log("effect");
  }, [count]);

  queueMicrotask(() => {
    console.log("after effect microtask");
  });
  queueMacrotask(() => {
    console.log("after effect macrotask");
  });

  return (
    <div ref={ref}>
      <div>Ref Component</div>
      <button onClick={forceUpdate}>Update</button>
    </div>
  );
}
