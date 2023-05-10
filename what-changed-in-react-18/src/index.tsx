import ReactDOM from "react-dom/client";
import ReactDOMOld from "react-dom";
import { App } from "./App";

const rootElement = document.getElementById("root")!;

function renderNew() {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<App />);
}

function renderOld() {
  ReactDOMOld.render(<App />, rootElement);
}

const renderMethod = import.meta.env.OLD_RENDER ? renderOld : renderNew;

renderMethod();
