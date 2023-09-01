import { useReducer, useLayoutEffect, useCallback } from "react";

export const UseLayoutEffect = () => {
  const [count, increment] = useReducer((v) => v + 1, 0);

  useLayoutEffect(() => {
    console.log("layout effect");
  }, []);

  const cbRef = useCallback(() => {
    console.log("cb ref");
  }, []);

  return (
    <div ref={cbRef}>
      <div>{count}</div>
      <button onClick={increment}>increment</button>
    </div>
  );
};
