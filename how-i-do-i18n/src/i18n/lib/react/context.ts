import { createContext } from "react";
import { I18N } from "../i18n";

export const I18NContext = createContext<I18N<any> | null>(null);
