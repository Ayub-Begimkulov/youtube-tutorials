import { useState } from "react";

import { SaveableTextInput } from "./slides/SaveableTextInput";
import { IncreaseElement } from "./slides/IncreaseElement";

const examplesMap = {
  input: SaveableTextInput,
  zoom: IncreaseElement,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("zoom");

  const Component = examplesMap[example];

  return (
    <div>
      <div style={{ marginBottom: 80 }}>
        {Object.keys(examplesMap).map((example) => (
          <button key={example} onClick={() => setExample(example as Example)}>
            {example}
          </button>
        ))}
      </div>

      <Component />
    </div>
  );
};
