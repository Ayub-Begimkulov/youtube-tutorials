import { useState } from "react";
import { Custom } from "./examples/Custom";
import { Library } from "./examples/Library";
import { CustomFull } from "./examples/CustomFull";

const examplesMap = {
  library: Library,
  custom: Custom,
  customFull: CustomFull,
};

type Example = keyof typeof examplesMap;

export function App() {
  const [example, setExample] = useState<Example>("library");

  const ExampleComponent = examplesMap[example];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          padding: "24px",
        }}
      >
        {Object.keys(examplesMap).map((key) => (
          <button key={key} onClick={() => setExample(key as Example)}>
            {key}
          </button>
        ))}
      </div>

      <ExampleComponent />
    </div>
  );
}
