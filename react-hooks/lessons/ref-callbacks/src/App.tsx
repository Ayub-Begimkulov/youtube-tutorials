import { useState } from "react";
import { Basic } from "./examples/Basic";
import {
  NullProblem,
  NullProblemPlainRefs,
  NullProblemSolved,
} from "./examples/NullProblem";
import { UsageDom } from "./examples/UsageDom";
import { WhenCalled } from "./examples/WhenCalled";
import { UsageCombine } from "./examples/UsageCombine";

const examplesMap = {
  basic: Basic,
  nullProblem: NullProblem,
  nullProblemPlanRef: NullProblemPlainRefs,
  nullProblemSolved: NullProblemSolved,
  whenCalled: WhenCalled,
  usageDom: UsageDom,
  usageCombine: UsageCombine,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("usageCombine");

  const Component = examplesMap[example];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
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
