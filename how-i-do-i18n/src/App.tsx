import { useState } from "react";
import { BasicExample } from "./pages/basic/BasicExample";
import { FormattingTextExample } from "./pages/formatting/FormattingTextExample";
import { FullExample } from "./pages/full/FullExample";

const pagesMap = {
  basic: "Basic",
  formatting: "Formatting",
  full: "Full",
};

type PageType = keyof typeof pagesMap;

export const App = () => {
  const [page, setPage] = useState<PageType>("full");

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          borderBottom: "1px solid lightgrey",
          display: "flex",
          gap: 8,
        }}
      >
        {Object.entries(pagesMap).map(([type, name]) => (
          <button key={type} onClick={() => setPage(type as PageType)}>
            {name}
          </button>
        ))}
      </div>

      {page === "basic" && <BasicExample />}
      {page === "formatting" && <FormattingTextExample />}
      {page === "full" && <FullExample />}
    </div>
  );
};
