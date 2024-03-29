import { useState } from "react";
import { DynamicHeight } from "./examples/DynamicHeight";
import { DynamicHeight as DynamicHeightImproved } from "./examples/DynamicHeight-improved";
import { Simple } from "./examples/Simple";
import { Grid, Grid2 } from "./examples/Grid";

const examplesMap = {
  simple: Simple,
  dynamicHeight: DynamicHeight,
  dynamicHeightImproved: DynamicHeightImproved,
  grid: Grid,
  grid2: Grid2,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("grid");
  const Component = examplesMap[example];
  return (
    <div>
      <div>
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
