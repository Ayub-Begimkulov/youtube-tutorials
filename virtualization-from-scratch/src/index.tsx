import ReactDOM from "react-dom/client";
import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element was not found in the document");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
