import { useState } from "react";
import { Basic } from "./examples/Basic";
import {
  NullProblem,
  NullProblemPlainRefs,
  NullProblemSolved,
} from "./examples/NullProblem";
import { UsageDom } from "./examples/UsageDom";
import { WhenCalled } from "./examples/WhenCalled";

const examplesMap = {
  basic: Basic,
  nullProblem: NullProblem,
  nullProblemPlanRef: NullProblemPlainRefs,
  nullProblemSolved: NullProblemSolved,
  whenCalled: WhenCalled,
  usageDom: UsageDom,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("basic");

  const Component = examplesMap[example];

  return (
    <>
      <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
        {Object.keys(examplesMap).map((key) => (
          <button key={key} onClick={() => setExample(key as Example)}>
            {key}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Component />
      </div>
    </>
  );
};
