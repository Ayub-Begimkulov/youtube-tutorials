import { useLayoutEffect, useReducer } from "react";

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
  }, [styles]);
}

export function CustomDepsManagementExample() {
  const [, forceUpdate] = useReducer((v) => v + 1, 0);

  useBodyStyles({
    height: "100%",
    width: "100%",
    background: "white",
  });

  return (
    <>
      <div>I just render for the sake of the example</div>
      <button onClick={forceUpdate}>Rerender component</button>
    </>
  );
}
