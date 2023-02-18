import { useState } from "react";
import { Mobx } from "./mobx/Mobx";
import { ReduxUnoptimized } from "./redux-unoptimized/ReduxUnoptimized";
import { Redux } from "./redux/Redux";

const pageIdToTitle = {
  mobx: "Mobx",
  reduxUnoptimized: "Redux Unoptimized",
  redux: "Redux",
} as const;

type PageType = keyof typeof pageIdToTitle;

export const App = () => {
  const [page, setPage] = useState<PageType>("mobx");

  return (
    <div>
      {Object.entries(pageIdToTitle).map(([pageType, pageTitle]) => (
        <button
          style={{ marginRight: 5 }}
          key={pageType}
          onClick={() => setPage(pageType as PageType)}
        >
          {pageTitle}
        </button>
      ))}

      <h1>{pageIdToTitle[page]}</h1>

      {page === "mobx" && <Mobx />}
      {page === "reduxUnoptimized" && <ReduxUnoptimized />}
      {page === "redux" && <Redux />}
    </div>
  );
};
