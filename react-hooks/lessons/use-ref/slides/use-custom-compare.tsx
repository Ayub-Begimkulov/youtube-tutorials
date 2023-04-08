import { useLayoutEffect, useReducer, useRef } from "react";
import { usePrevious } from "./use-previous";
import { shallowEqual } from "shallow-equal";

function useCustomCompare<T>(
  value: T,
  areEqual: (previous: T, current: T) => boolean
) {
  const changeRef = useRef(0);
  const previousValue = usePrevious(value).current;

  if (changeRef.current === 0 || !areEqual(previousValue as T, value)) {
    changeRef.current++;
  }

  return changeRef.current;
}

function useBodyStyles(styles: React.CSSProperties) {
  useLayoutEffect(() => {
    console.log("effect");
    Object.entries(styles).map(([style, value]) => {
      document.body.style.setProperty(
        style,
        // will not work for all cases
        String(value)
      );
    });
  }, [useCustomCompare(styles, shallowEqual)]);
}

export function CustomDepsManagementSolution() {
  const [, forceUpdate] = useReducer((v) => v + 1, 0);

  useBodyStyles({
    height: "100%",
    width: "100%",
    background: "white",
    transform: "translateX(0px)",
  });

  return (
    <>
      <div>I just render for the sake of the example</div>
      <button onClick={forceUpdate}>Rerender component</button>
    </>
  );
}
