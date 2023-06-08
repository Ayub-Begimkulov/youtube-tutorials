import ReactDOMOld from "react-dom";
import ReactDOMNew from "react-dom/client";

import { App } from "./App";

const rootElement = document.getElementById("root")!;

function renderOld() {
  ReactDOMOld.render(<App />, rootElement);
}

function renderNew() {
  ReactDOMNew.createRoot(rootElement).render(<App />);
}

const render =
  import.meta.env.VITE_RENDER_TYPE === "old" ? renderOld : renderNew;

render();
