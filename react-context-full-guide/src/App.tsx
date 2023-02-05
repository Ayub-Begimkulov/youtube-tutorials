import { useState } from "react";
import { Issues } from "./pages/Issues";
import { NoContext } from "./pages/NoContext";
import { Optimized } from "./pages/Optimized";
import { Recommended } from "./pages/Recommended";
import { Simple } from "./pages/Simple";

type PageType =
  | "no-context"
  | "simple"
  | "recommended"
  | "issues"
  | "optimized";

const pageTypeToName: Record<PageType, string> = {
  "no-context": "No Context",
  simple: "Simple",
  recommended: "Recommended",
  issues: "Issues",
  optimized: "Optimized",
};

export const App = () => {
  const [page, setPage] = useState<PageType>("no-context");

  return (
    <div>
      {(Object.keys(pageTypeToName) as PageType[]).map((key) => (
        <button key={key} onClick={() => setPage(key)}>
          {pageTypeToName[key]}
        </button>
      ))}

      <h1>Type: {pageTypeToName[page]}</h1>

      {page === "no-context" && <NoContext />}
      {page === "simple" && <Simple />}
      {page === "recommended" && <Recommended />}
      {page === "issues" && <Issues />}
      {page === "optimized" && <Optimized />}
    </div>
  );
};
