import { useEffect, useRef, useState } from "react";
import { storageAPI } from "../api/storage";

export const SaveableTextInput = () => {
  const [text, setText] = useState("");
  const isTextEdited = useRef(false);

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isTextEdited.current = true;
    setText(e.target.value);
    storageAPI.save(text);
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
