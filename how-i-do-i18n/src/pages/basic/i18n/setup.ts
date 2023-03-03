import {
  I18N,
  useI18N as useI18NBase,
  useTranslate as useTranslateBase,
  pluralizeRu,
  pluralizeEn,
} from "../../../i18n/lib";
import { en } from "./keys/en";
import { ru } from "./keys/ru";

/* const timeout =
    <T>(timeout: number) =>
    (value: T) => {
      return new Promise<T>((res) => {
        setTimeout(() => res(value), timeout);
      });
    };
  
  const loadEn = () =>
    import("./keys/en").then((module) => module.en).then(timeout(1_500));
  const loadRu = () =>
    import("./keys/ru").then((module) => module.ru).then(timeout(1_500)); */

export const i18n = new I18N({
  defaultLang: "ru",
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

export const useTranslate = useTranslateBase<typeof i18n>;
export const useI18N = useI18NBase<typeof i18n>;
