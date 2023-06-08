import { useEffect, useReducer } from "react";
import { queueMacrotask } from "../utils";

export function UseEffectUpdate() {
  const [count, increment] = useReducer((v) => v + 1, 0);
  const [forceUpdateCount, forceUpdate] = useReducer((v) => v + 1, 0);

  (window as any).updateComponent = forceUpdate;

  useEffect(() => {
    queueMicrotask(() => {
      console.log("before update microtask");
    });
    queueMacrotask(() => {
      console.log("before update macrotask");
    });

    console.log("trigger update effect");
    increment();

    queueMicrotask(() => {
      console.log("after update microtask");
    });
    queueMacrotask(() => {
      console.log("after update macrotask");
    });
  }, [forceUpdateCount]);

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
    <div>
      <div>Inside Effect</div>
      <button onClick={forceUpdate}>Update</button>
    </div>
  );
}
