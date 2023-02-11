import { useState } from "react";
import { Simple } from "./pages/Simple";
import { NoContext } from "./pages/NoContext";
import { Recommended } from "./pages/Recommended";
import { ClassComponents } from "./pages/ClassComponents";
import { Issues } from "./pages/Issues";
import { Optimized } from "./pages/Optimized";

const pageTypeToName = {
  "no-context": "No Context",
  simple: "Simple",
  recommended: "Recommended",
  "class-components": "Class Components",
  issues: "Issues",
  optimized: "Optimized",
};

type PageType = keyof typeof pageTypeToName;

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
      {page === "class-components" && <ClassComponents />}
      {page === "issues" && <Issues />}
      {page === "optimized" && <Optimized />}
    </div>
  );
};
