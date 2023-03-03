import ReactDOM from "react-dom/client";
import { App } from "./App";
import { I18NProvider } from "./i18n/lib";
import { i18n } from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <I18NProvider i18n={i18n}>
    <App />
  </I18NProvider>
);
