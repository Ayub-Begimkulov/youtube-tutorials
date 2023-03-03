import {
  I18N,
  pluralizeEn,
  pluralizeRu,
  useTranslate as useTranslateBase,
  useI18N as useI18NBase,
} from "../../../i18n";

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

export const useTranslate = useTranslateBase<typeof i18n>;
export const useI18N = useI18NBase<typeof i18n>;
