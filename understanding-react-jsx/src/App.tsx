import React, { useState } from "react";

function Component() {
  const [count, setCount] = useState(0);

  console.log("render component");

  return (
    <div>
      {count}
      <br />
      <button onClick={() => setCount((c) => c + 1)} style={{ marginRight: 8 }}>
        Increment
      </button>
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
    </div>
  );
}

function JSXTest() {
  const [showTest, setShowTest] = useState(true);

  console.log("render jsx test");

  return (
    <div>
      <button onClick={() => setShowTest((v) => !v)}>Toggle</button>

      {/* {showTest && <Component />} */}
      {showTest && Component()}
    </div>
  );
}

export const App = () => {
  return (
    <div>
      <JSXTest />
    </div>
  );
};
