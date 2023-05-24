import { useCallback, useEffect, useReducer, useRef, useState } from "react";

export function NullProblem() {
  const [showItem, setShowItem] = useState(true);
  const [, forceUpdate] = useReducer((v) => v + 1, 0);

  const cbRef = (element: HTMLElement | null) => {
    console.log(element);
  };

  return (
    <div>
      <button onClick={forceUpdate}>Rerender</button>
      <button onClick={() => setShowItem((v) => !v)}>Toggle</button>
      {showItem && <div ref={cbRef}>I'm div</div>}
    </div>
  );
}

export function NullProblemPlainRefs() {
  const [count, forceUpdate] = useReducer((v) => v + 1, 0);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);

  const isFirstRef = count % 2 === 0;
  const actualRef = isFirstRef ? ref1 : ref2;

  useEffect(() => {
    console.log({ ref1: ref1.current, ref2: ref2.current });
  }, [isFirstRef]);

  return (
    <div>
      <button onClick={forceUpdate}>Rerender</button>
      <div ref={actualRef}>I'm div</div>
    </div>
  );
}

export function NullProblemSolved() {
  const [showItem, setShowItem] = useState(true);
  const [, forceUpdate] = useReducer((v) => v + 1, 0);

  const cbRef = useCallback((element: HTMLElement | null) => {
    console.log(element);
  }, []);

  return (
    <div>
      <button onClick={forceUpdate}>Rerender</button>
      <button onClick={() => setShowItem((v) => !v)}>Toggle</button>
      {showItem && <div ref={cbRef}>I'm div</div>}
    </div>
  );
}
