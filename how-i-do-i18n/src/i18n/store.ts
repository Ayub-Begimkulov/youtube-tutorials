import { createContext, useCallback, useContext, useEffect } from "react";
import { I18N } from "./i18n";
import { en } from "./keys/en";
import { ru } from "./keys/ru";
import { pluralizeRu, pluralizeEn } from "./plurals";

const languageToPluralizeMap = {
  ru: pluralizeRu,
  en: pluralizeEn,
};

const i18n = new I18N({
  defaultLang: "en",
  keysets: {
    en,
    ru,
  },
});

export type Lang = ReturnType<typeof i18n.getLang>;
type KeysetType = ReturnType<typeof i18n.getKeyset>;
type TranslationKeys = keyof KeysetType;

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
  // const i18n = useI18NContext();
  // useEffect(() => {
  //   i18n.subscribe();
  // }, [i18n]);
  // const translate = useCallback(
  //   <Key extends TranslationKeys>(key: Key, ...rest: GetRestParams<Key>) => {
  //     const keyset = i18n.getKeyset();
  //     const translation: string | Record<string, string> | undefined =
  //       keyset[key];
  //     if (typeof translation === "undefined") {
  //       return key;
  //     }
  //     const [params = {}] = rest;
  //     if (typeof translation === "string") {
  //       return interpolateTranslation(translation, params);
  //     }
  //     const pluralizeFn = languageToPluralizeMap[i18n.getLang()];
  //     const pluralKey = pluralizeFn(params.count as number);
  //     const pluralizedTranslation = translation[pluralKey]!;
  //     return interpolateTranslation(pluralizedTranslation, params);
  //   },
  //   [i18n]
  // );
  // return translate;
}

const mustacheParamRegex = /\{\{\s*([a-zA-Z10-9]+)\s*\}\}/g;

// not the most performant way, but it should be okay
function interpolateTranslation(
  translation: string,
  params: Record<string, string | number>
) {
  return translation.replace(mustacheParamRegex, (original, paramKey) => {
    if (paramKey in params) {
      return String(params[paramKey]);
    }

    return original;
  });
}
