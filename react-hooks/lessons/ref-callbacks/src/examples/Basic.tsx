import { useState } from "react";

export function Basic() {
  const [showItem, setShowItem] = useState(true);

  const cbRef = (element: HTMLElement | null) => {
    console.log(element);
  };

  return (
    <div>
      <button onClick={() => setShowItem((v) => !v)}>Toggle</button>
      {showItem && <div ref={cbRef}>I'm div</div>}
    </div>
  );
}
