import ReactDOM from "react-dom/client";
import { App } from "./App";
import { i18n, I18NProvider } from "./i18n/react";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <I18NProvider value={i18n}>
    <App />
  </I18NProvider>
);
