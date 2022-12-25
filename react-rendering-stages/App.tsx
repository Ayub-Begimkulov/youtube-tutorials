import React from "react";
import { useEffect, useLayoutEffect, useReducer } from "react";

export const App = () => {
  const [num, triggerRerender] = useReducer((v) => v + 1, 0);

  (window as any).triggerRerender = triggerRerender;

  console.log("parent: render");

  useLayoutEffect(() => {
    console.log("parent: layout effect");
    return () => {
      console.log("parent: cleanup layout effect");
    };
  }, [num]);

  useEffect(() => {
    console.log("parent: effect");
    return () => {
      console.log("parent: cleanup effect");
    };
  }, [num]);

  return <Child num={num} />;
};

const Child = ({ num }: { num: number }) => {
  console.log("child: render");

  useLayoutEffect(() => {
    console.log("child: layout effect");
    return () => {
      console.log("child: cleanup layout effect");
    };
  }, [num]);

  useEffect(() => {
    console.log("child: effect");
    return () => {
      console.log("child: cleanup effect");
    };
  }, [num]);

  return null;
};
