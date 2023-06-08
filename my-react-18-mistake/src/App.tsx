import { useState } from "react";

import { ClickEvent } from "./examples/ClickEvent";
import { OutsideOfReact } from "./examples/OutsideOfReact";
import { RefCallback } from "./examples/RefCallback";
import { UseEffectUpdate } from "./examples/UseEffectUpdate";

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    gap: 24,
  },
  example: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
};

const examplesMap = {
  clickEvent: ClickEvent,
  outsideOfReact: OutsideOfReact,
  refCallback: RefCallback,
  useEffect: UseEffectUpdate,
};

type Example = keyof typeof examplesMap;

const title =
  import.meta.env.VITE_RENDER_TYPE === "new" ? "New Root" : "Old Root";

export const App = () => {
  const [example, setExample] = useState<Example>("useEffect");

  const Component = examplesMap[example];

  return (
    <div style={styles.container}>
      <h2>{title}</h2>
      <div style={styles.header}>
        {Object.keys(examplesMap).map((exampleKey) => (
          <button
            key={exampleKey}
            onClick={() => setExample(exampleKey as Example)}
          >
            {exampleKey}
          </button>
        ))}
      </div>
      <div style={styles.example}>
        <Component />
      </div>
    </div>
  );
};

/* 

declare global {
  interface Window {
    getCurrentUpdatePriority(): number;
  }
}

export const App2 = () => {
  const [count, increment] = useReducer((v) => v + 1, 0);

  (window as any).updateComponent = () => {
    increment();
    console.log(window.getCurrentUpdatePriority());
  };

  const handleForceUpdate = () => {
    increment();
    console.log(window.getCurrentUpdatePriority());
  };

  return (
    <div>
      <button onClick={handleForceUpdate}>Force Update</button>
      <Component2 count={count} />
    </div>
  );
};

const Component = ({ count }: { count: number }) => {
  const [innerCount, setInnerCount] = useState(0);

  queueMacrotask(() => {
    console.log("render macrotask");
  });
  queueMicrotask(() => {
    console.log("render microtask");
  });

  useLayoutEffect(() => {
    console.log("layout effect");
  }, [count]);

  useEffect(() => {
    console.log("effect");
  }, [count]);

  return null;
};

const Component2 = ({ count }: { count: number }) => {
  const [innerCount, setInnerCount] = useState(0);

  useEffect(() => {
    queueMacrotask(() => {
      console.log("macrotask");
    });
    queueMicrotask(() => {
      console.log("microtask");
    });
    console.log("update state effect");
    console.log(window.getCurrentUpdatePriority());
    setInnerCount((c) => c + 1);
    queueMicrotask(() => {
      console.log("microtask");
    });
  }, [count]);

  useEffect(() => {
    console.log("effect");
  }, [innerCount]);

  return null;
};
 */
