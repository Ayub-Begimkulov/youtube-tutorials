import { Fragment } from "react";

import { I18N } from "../i18n";
import { I18NContext } from "./context";

interface I18NProviderProps {
  i18n: I18N<any>;
  children: React.ReactNode;
}

export const I18NProvider = ({ i18n, children }: I18NProviderProps) => {
  return <I18NContext.Provider value={i18n}>{children}</I18NContext.Provider>;
};

interface TaggedTextProps {
  text: string;
  tags?: Record<string, (str: string) => JSX.Element>;
}

const tagsRegex = /(<\d+>[^<>]*<\/\d+>)/;
const openCloseTagRegex = /<(\d+)>([^<>]*)<\/(\d+)>/;

const interpolateTags = (
  text: string,
  params?: Record<string, (str: string) => JSX.Element>
) => {
  if (!params) {
    return text;
  }

  const tokens = text.split(tagsRegex);

  return tokens.map((token) => {
    const matchResult = openCloseTagRegex.exec(token);

    if (!matchResult) {
      return token;
    }

    const [, openTag, content, closeTag] = matchResult;

    if (!openTag || !closeTag || openTag !== closeTag) {
      return token;
    }

    return (
      <Fragment key={content}>{params[openTag]?.(content ?? "")}</Fragment>
    );
  });
};

export const TaggedText = ({ text, tags }: TaggedTextProps) => {
  return <>{interpolateTags(text, tags)}</>;
};
