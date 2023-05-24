import { useCallback, useEffect, useLayoutEffect } from "react";

export function WhenCalled() {
  const cbRef = useCallback((element: HTMLElement | null) => {
    console.log("callback ref", element);
  }, []);

  useEffect(() => {
    console.log("effect");
  }, []);

  useLayoutEffect(() => {
    console.log("layout effect");
  }, []);

  return (
    <div>
      <Child />
      <div ref={cbRef}>I'm div</div>
    </div>
  );
}

function Child() {
  const cbRef = useCallback((element: HTMLElement | null) => {
    console.log("child callback ref", element);
  }, []);

  useEffect(() => {
    console.log("child effect");
  }, []);

  useLayoutEffect(() => {
    console.log("child layout effect");
  }, []);

  return <div ref={cbRef}>I'm child div</div>;
}
