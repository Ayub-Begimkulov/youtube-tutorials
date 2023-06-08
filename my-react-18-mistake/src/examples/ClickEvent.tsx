import { useEffect, useReducer } from "react";
import { queueMacrotask } from "../utils";

export function ClickEvent() {
  const [count, increment] = useReducer((v) => v + 1, 0);

  const handleClick = () => {
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
  };

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
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
