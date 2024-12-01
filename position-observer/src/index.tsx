import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./style.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root element not found");
}

ReactDOM.createRoot(root).render(<App />);
