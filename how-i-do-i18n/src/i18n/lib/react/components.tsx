import { I18N } from "../i18n";
import { I18NContext } from "./context";

interface I18NProviderProps {
  i18n: I18N<any>;
  children: React.ReactNode;
}

export const I18NProvider = ({ i18n, children }: I18NProviderProps) => {
  return <I18NContext.Provider value={i18n}>{children}</I18NContext.Provider>;
};
