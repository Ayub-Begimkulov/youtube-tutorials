import { useState } from "react";
import { UseSafeStateExample } from "./slides/use-safe-state";
import { UseSearchParamsStateExample } from "./slides/use-query-params-state";
import { UseLocalSessionStorageExample } from "./slides/use-local-session-storage";
import { UseMapSetExample } from "./slides/use-map-set";

const examplesMap = {
  useSafeState: UseSafeStateExample,
  useSearchParamsState: UseSearchParamsStateExample,
  useLocalSessionStorage: UseLocalSessionStorageExample,
  useMapSet: UseMapSetExample,
};

type Example = keyof typeof examplesMap;

export const App = () => {
  const [example, setExample] = useState<Example>("useMapSet");

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
