import { useI18NContext, useTranslate } from "./i18n/react";

export const App = () => {
  const translate = useTranslate();
  const i18n = useI18NContext();

  const updateLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.setLang(e.target.value as "en" | "ru");
  };

  return (
    <div>
      <div>{translate("test")}</div>
      <select value={i18n.getLang()} onChange={updateLang}>
        <option value={"en"}>En</option>
        <option value={"ru"}>Ru</option>
      </select>
    </div>
  );
};
