import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { I18N } from "./i18n";
import { pluralizeRu, pluralizeEn } from "./plurals";

const timeout =
  <T>(timeout: number) =>
  (value: T) => {
    return new Promise<T>((res) => {
      setTimeout(() => res(value), timeout);
    });
  };

const loadEn = () =>
  import("./keys/en").then((module) => module.en).then(timeout(1_500));
const loadRu = () =>
  import("./keys/ru").then((module) => module.ru).then(timeout(1_500));

export const i18n = new I18N({
  defaultLang: "ru",
  languages: {
    en: {
      keyset: loadEn,
      pluralize: pluralizeEn,
    },
    ru: {
      keyset: loadRu,
      pluralize: pluralizeRu,
    },
  },
});

export type Lang = ReturnType<typeof i18n.getLang>;

const I18NContext = createContext<typeof i18n | null>(null);

export function useI18NContext() {
  const i18n = useContext(I18NContext);

  if (!i18n) {
    throw new Error("can not `useI18NContext` outside of the `I18NProvider`");
  }

  return i18n;
}

export const I18NProvider = I18NContext.Provider;

export function useTranslate() {
  const i18n = useI18NContext();
  const [updateCount, triggerUpdate] = useReducer((v) => v + 1, 0);

  useEffect(() => {
    return i18n.subscribe(() => {
      triggerUpdate();
    });
  }, []);

  const translate: typeof i18n.get = useCallback(
    (...args) => {
      return i18n.get(...args);
    },
    // include the lang into the deps array
    // so that translate changes it's reference whenever the language changes
    [updateCount]
  );

  return translate;
}
