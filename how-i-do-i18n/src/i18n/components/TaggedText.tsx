import { Fragment } from "react";

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
