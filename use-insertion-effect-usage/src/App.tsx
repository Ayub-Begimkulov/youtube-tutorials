import { useState } from "react";
import { Basic } from "./examples/Basic";
import { CallbackRefs } from "./examples/CallbackRefs";
import { UseLayoutEffect } from "./examples/UseLayoutEffect";
import { UseInsertionEffect } from "./examples/UseInsertionEffect";

const examplesMap = {
  basic: Basic,
  layoutEffect: UseLayoutEffect,
  callbackRefs: CallbackRefs,
  insertionEffect: UseInsertionEffect,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("insertionEffect");
  const Component = examplesMap[example];

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        {Object.keys(examplesMap).map((exampleKey) => (
          <button
            key={exampleKey}
            onClick={() => setExample(exampleKey as Example)}
          >
            {exampleKey}
          </button>
        ))}
      </div>
      {<Component />}
    </div>
  );
};
