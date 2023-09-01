import {
  useRef,
  useInsertionEffect,
  useReducer,
  useEffect,
  useLayoutEffect,
} from "react";

function useLatest<T>(value: T) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}

export const Basic = () => {
  const [count, increment] = useReducer((v) => v + 1, 0);
  const latestCount = useLatest(count);

  useEffect(() => {
    console.log("attach event listeners");

    const handleClick = () => {
      console.log("count", latestCount.current);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [latestCount]);

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>increment</button>
    </div>
  );
};
