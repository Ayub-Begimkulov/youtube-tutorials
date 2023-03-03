// we might have translation as an object, if it's plural
type Translation = string | Record<string, string>;
type Keyset = Record<string, Translation>;

export type LanguageConfig = {
  keyset: Keyset | (() => Promise<Keyset>);
  pluralize: (count: number) => string;
};

interface I18NOptions<
  LanguagesMap extends Record<string, LanguageConfig>,
  Lang extends keyof LanguagesMap = keyof LanguagesMap
> {
  defaultLang: Lang;
  languages: LanguagesMap;
}

type KeyType<KeysetsMap extends Record<string, LanguageConfig>> =
  keyof KeysetType<KeysetsMap>;

type KeysetType<KeysetsMap extends Record<string, LanguageConfig>> =
  UnwrapKeysetType<KeysetsMap[keyof KeysetsMap]["keyset"]>;

type UnwrapKeysetType<
  MaybeUnresolvedKeyset extends Keyset | (() => Promise<Keyset>)
> = MaybeUnresolvedKeyset extends () => Promise<infer ResolvedKeyset>
  ? ResolvedKeyset
  : MaybeUnresolvedKeyset;

type GetRestParams<
  KeysetsMap extends Record<string, LanguageConfig>,
  Key extends KeyType<KeysetsMap>
> = KeysetType<KeysetsMap>[Key] extends object
  ? [options: { count: number; [key: string]: number | string }]
  : [options?: Record<string, string | number>];

export class I18N<KeysetsMap extends Record<string, LanguageConfig>> {
  private lang: keyof KeysetsMap;
  private subscribers = new Set<(lang: keyof KeysetsMap) => void>();
  private keysets: KeysetsMap;

  constructor(options: I18NOptions<KeysetsMap>) {
    this.keysets = options.languages;

    this.setLang(options.defaultLang);
    // call it just for the TS to not complain
    this.lang = options.defaultLang;
  }

  getLang() {
    return this.lang;
  }

  get<Key extends KeyType<KeysetsMap>>(
    key: Key,
    ...rest: GetRestParams<KeysetsMap, Key>
  ): string {
    const { keyset, pluralize } = this.keysets[this.lang]!;

    if (typeof keyset === "function") {
      return String(key);
    }

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

  async setLang(newLang: keyof KeysetsMap) {
    try {
      if (newLang === this.lang) {
        return;
      }

      const { keyset } = this.keysets[newLang]!;

      if (typeof keyset === "function") {
        const resolvedKeyset = await keyset();

        this.keysets[newLang]!.keyset = resolvedKeyset;
      }

      this.lang = newLang;

      this.subscribers.forEach((cb) => cb(newLang));
    } catch (error) {
      console.error(
        `Error happened trying to update language. Can not resolve lazy loaded keyset for "${String(
          newLang
        )}" language. See the error below to get more details`
      );
      throw error;
    }
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
