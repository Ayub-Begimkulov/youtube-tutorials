import { i18n, useI18N, useTranslate, I18NProvider } from "./i18n";

export const BasicExample = () => {
  return (
    <I18NProvider i18n={i18n}>
      <BasicExampleInner />
    </I18NProvider>
  );
};

export const BasicExampleInner = () => {
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
          maxWidth: 300,
        }}
      >
        {translate("test_key")}
      </div>
    </div>
  );
};
