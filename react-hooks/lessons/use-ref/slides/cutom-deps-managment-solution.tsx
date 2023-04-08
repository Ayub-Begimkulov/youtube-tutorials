import { useLayoutEffect, useReducer, useRef } from "react";
import { usePrevious } from "./use-previous";
import { shallowEqual } from "shallow-equal";

function useBodyStyles(styles: React.CSSProperties) {
  const shouldRunEffect = useRef(0);
  const previousStyles = usePrevious(styles).current;

  if (previousStyles && !shallowEqual(previousStyles, styles)) {
    shouldRunEffect.current++;
  }

  useLayoutEffect(() => {
    console.log("effect");
    Object.entries(styles).map(([style, value]) => {
      document.body.style.setProperty(
        style,
        // will not work for all cases
        String(value)
      );
    });
  }, [shouldRunEffect.current]);
}

export function CustomDepsManagementSolution() {
  const [, forceUpdate] = useReducer((v) => v + 1, 0);

  useBodyStyles({
    height: "100%",
    width: "100%",
    background: "white",
    transform: "translateX(0)",
  });

  return (
    <>
      <div>I just render for the sake of the example</div>
      <button onClick={forceUpdate}>Rerender component</button>
    </>
  );
}
