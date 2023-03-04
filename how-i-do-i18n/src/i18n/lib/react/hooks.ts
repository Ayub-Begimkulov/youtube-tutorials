import { useCallback, useContext, useEffect, useReducer } from "react";
import type { I18N } from "../i18n";
import { I18NContext } from "./context";

export function useI18N<I18NType extends I18N<any>>() {
  const i18n = useContext(I18NContext) as I18NType;

  if (!i18n) {
    throw new Error("can not `useI18NContext` outside of the `I18NProvider`");
  }

  return i18n;
}

export function useTranslate<I18NType extends I18N<any>>() {
  const i18n = useI18N();
  const [updateCount, triggerUpdate] = useReducer((v) => v + 1, 0);

  useEffect(() => {
    return i18n.subscribe(() => {
      triggerUpdate();
    });
  }, []);

  const translate: I18NType["get"] = useCallback(
    (key, ...rest) => {
      return i18n.get(key, ...rest);
    },
    // include the `updateCount` into the deps array
    // so that translate changes it's reference whenever the language changes
    [updateCount]
  );

  return translate;
}
