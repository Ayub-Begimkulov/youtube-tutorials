import { useEffect, useRef, useState } from "react";
import { storageAPI } from "../api/storage";
import { useDebounceEffect } from "./effects";

export const SaveableTextInput = () => {
  const [text, setText] = useState("");
  const isTextEdited = useRef(false);

  useDebounceEffect(
    () => {
      storageAPI.save(text);
    },
    [text],
    500
  );

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isTextEdited.current = true;
    setText(e.target.value);
  };

  useEffect(() => {
    storageAPI.read().then((text) => {
      if (isTextEdited.current) {
        return;
      }
      setText(text);
    });
  }, []);

  return (
    <div>
      <textarea value={text} onChange={handleUpdate} rows={30} cols={80} />
    </div>
  );
};
