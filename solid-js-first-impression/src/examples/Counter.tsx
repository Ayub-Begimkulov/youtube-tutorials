import { createSignal } from "solid-js";

export const Counter = () => {
  const [count, setCount] = createSignal(0);

  const increment = () => {
    console.log("increment");
    setCount((count) => count + 1);
  };

  const decrement = () => {
    console.log("decrement");
    setCount(count() - 1);
  };

  console.log("mount");

  return (
    <>
      <div>{count()}</div>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </>
  );
};
