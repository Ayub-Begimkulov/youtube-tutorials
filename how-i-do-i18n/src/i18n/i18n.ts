// we might have translation as an object, if it's plural
type Translation = string | Record<string, string>;
type LanguageConfig = {
  keyset: Record<string, Translation>;
  pluralize: (count: number) => string;
};

interface I18NOptions<
  LanguagesMap extends Record<string, LanguageConfig>,
  Lang extends keyof LanguagesMap = keyof LanguagesMap
> {
  defaultLang: Lang;
  languages: LanguagesMap;
}

type GetRestParams<
  KeysetsMap extends Record<string, LanguageConfig>,
  Key extends keyof KeysetsMap[keyof KeysetsMap]["keyset"]
> = KeysetsMap[keyof KeysetsMap]["keyset"][Key] extends object
  ? [options: { count: number; [key: string]: number | string }]
  : [options?: Record<string, string | number>];

export class I18N<KeysetsMap extends Record<string, LanguageConfig>> {
  private lang: keyof KeysetsMap;
  private subscribers = new Set<(lang: keyof KeysetsMap) => void>();
  private keysets: KeysetsMap;

  constructor(options: I18NOptions<KeysetsMap>) {
    this.lang = options.defaultLang;
    this.keysets = options.languages;
  }

  getLang() {
    return this.lang;
  }

  getKeyset() {
    return this.keysets[this.lang];
  }

  get<Key extends keyof KeysetsMap[keyof KeysetsMap]["keyset"]>(
    key: Key,
    ...rest: GetRestParams<KeysetsMap, Key>
  ): string {
    const { keyset, pluralize } = this.getKeyset()!;

    const translation: string | Record<string, string> | undefined =
      keyset[key];

    if (typeof translation === "undefined") {
      return String(key);
    }
    const [params = {}] = rest;

    if (typeof translation === "string") {
      return interpolateTranslation(translation, params);
    }

    const pluralKey = pluralize(params.count as number);

    const pluralizedTranslation = translation[pluralKey]!;

    return interpolateTranslation(pluralizedTranslation, params);
  }

  setLang(newLang: string) {
    if (newLang === this.lang) {
      return;
    }

    this.lang = newLang;

    this.subscribers.forEach((cb) => cb(newLang));
  }

  subscribe(
    cb: (fn: keyof KeysetsMap) => void,
    options?: { immediate: boolean }
  ) {
    this.subscribers.add(cb);

    if (options?.immediate) {
      cb(this.lang);
    }

    return () => {
      this.subscribers.delete(cb);
    };
  }
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
