import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./style.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
