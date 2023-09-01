import { useRef, useLayoutEffect, useCallback, useState } from "react";

function useLatest<T>(value: T) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}

export const CallbackRefs = () => {
  const [elements, setElements] = useState<number[]>([]);
  const latestElements = useLatest(elements);

  const addElement = () => {
    setElements((elements) => [...elements, Math.round(Math.random() * 1000)]);
  };

  const cbRef = useCallback(
    (element: Element | null) => {
      if (!element) {
        return;
      }

      const lastElement = latestElements.current.at(-1);
      console.log("mounted element with value", lastElement);
    },
    [latestElements]
  );

  return (
    <div>
      <button onClick={addElement}>addElement</button>
      {elements.map((element) => (
        <div ref={cbRef} key={element}>
          {element}
        </div>
      ))}
    </div>
  );
};
