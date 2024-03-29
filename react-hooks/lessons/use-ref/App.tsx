import { useState } from "react";
import { Simple } from "./slides/simple";
import { PreserveRef } from "./slides/preserve-ref";
import { UncontrolledFormComponentProblem } from "./slides/uncontrolled-form-problem";
import { UncontrolledFormComponentSolution } from "./slides/uncontrolled-form-solution";
import { UseWindowEventExample } from "./slides/use-widnow-event";
import { UseWindowEventExampleWithEvent } from "./slides/use-widnow-event-with-event";
import { UseIsMountedExample } from "./slides/use-is-mounted";
import { CustomDepsManagementExample } from "./slides/cutom-deps-managment";
import { CustomDepsManagementSolution } from "./slides/cutom-deps-managment-solution";

const examplesMap = {
  simple: Simple,
  preserveRef: PreserveRef,
  uncontrolledFormProblem: UncontrolledFormComponentProblem,
  uncontrolledFormSolution: UncontrolledFormComponentSolution,
  useWindowEvent: UseWindowEventExample,
  UseWindowEventExampleWithEvent: UseWindowEventExampleWithEvent,
  useIsMounted: UseIsMountedExample,
  customDepsManagement: CustomDepsManagementExample,
  CustomDepsManagementSolution: CustomDepsManagementSolution,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("simple");

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
