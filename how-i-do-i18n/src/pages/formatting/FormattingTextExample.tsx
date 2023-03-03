import { i18n, I18NProvider, TaggedText, useI18N, useTranslate } from "./i18n";

export const FormattingTextExample = () => {
  return (
    <I18NProvider i18n={i18n}>
      <FormattingTextExampleInner />
    </I18NProvider>
  );
};

const FormattingTextExampleInner = () => {
  const translate = useTranslate();
  const i18n = useI18N();

  const updateLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.setLang(e.target.value as "en" | "ru");
  };

  return (
    <div style={{ margin: 12 }}>
      <select
        value={i18n.getLang()}
        onChange={updateLang}
        style={{ marginBottom: 8 }}
      >
        <option value={"ru"}>Ru</option>
        <option value={"en"}>En</option>
      </select>
      <div
        style={{
          padding: 20,
          borderRadius: 8,
          border: "1px solid grey",
          maxWidth: 500,
        }}
      >
        <h1>{translate("welcome", { name: "Ayub" })}</h1>
        <p>
          <TaggedText
            text={translate("message")}
            tags={{
              1: (text) => (
                <button
                  onClick={() => window.open("https://google.com", "_blank")}
                >
                  {text}
                </button>
              ),
              2: (text) => (
                <a href="https://ya.ru" target="_blank">
                  {text}
                </a>
              ),
            }}
          />
        </p>
      </div>
    </div>
  );
};
