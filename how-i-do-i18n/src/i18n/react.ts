import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { I18N } from "./i18n";
import { en } from "./keys/en";
import { ru } from "./keys/ru";
import { pluralizeRu, pluralizeEn } from "./plurals";

const load = () => import("./keys/en").then((module) => module.en);

const i18n = new I18N({
  defaultLang: "en",
  languages: {
    en: {
      keyset: en,
      pluralize: pluralizeEn,
    },
    ru: {
      keyset: ru,
      pluralize: pluralizeRu,
    },
  },
});

export type Lang = ReturnType<typeof i18n.getLang>;

const I18NContext = createContext<typeof i18n | null>(null);

function useI18NContext() {
  const i18n = useContext(I18NContext);

  if (!i18n) {
    throw new Error("can not `useI18NContext` outside of the `I18NProvider`");
  }

  return i18n;
}

export const I18NProvider = I18NContext.Provider;

export function useTranslate() {
  const i18n = useI18NContext();
  const [lang, setLang] = useState(i18n.getLang());

  useEffect(() => {
    return i18n.subscribe((newLang) => {
      setLang(newLang);
    });
  }, []);

  const translate: typeof i18n.get = useCallback(
    (...args) => {
      return i18n.get(...args);
    },
    // include the lang into the deps array
    // so that translate changes it's reference whenever the language changes
    [lang]
  );

  return translate;
}
