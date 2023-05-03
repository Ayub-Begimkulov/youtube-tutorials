import { useEffect, useMemo, useRef, useState } from "react";
import { storageAPI } from "../api/storage";
import { debounce } from "../utils";

export const SaveableTextInput = () => {
  const [text, setText] = useState("");
  const isTextEdited = useRef(false);

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isTextEdited.current = true;
    setText(e.target.value);
    persistCurrentText(e.target.value);
  };

  const persistCurrentText = useMemo(
    () =>
      debounce((text: string) => {
        storageAPI.save(text);
      }, 500),
    []
  );

  useEffect(() => {
    storageAPI.read().then(() => {
      if (isTextEdited.current) {
        return;
      }
      setText(text);
    });
  }, []);

  return (
    <div>
      <textarea onChange={handleUpdate} rows={30} cols={80} />
    </div>
  );
};
