import { useState } from "react";
import { Context } from "./Context/Context";
import { Store } from "./WithStore/Store";

const pageTypeToName = {
  context: "Context",
  store: "Store",
};

type PageType = keyof typeof pageTypeToName;

export const App = () => {
  const [page, setPage] = useState<PageType>("context");

  return (
    <div>
      {(Object.keys(pageTypeToName) as PageType[]).map((key) => (
        <button key={key} onClick={() => setPage(key)}>
          {pageTypeToName[key]}
        </button>
      ))}

      <h1>Type: {pageTypeToName[page]}</h1>

      {page === "context" && <Context />}
      {page === "store" && <Store />}
    </div>
  );
};
