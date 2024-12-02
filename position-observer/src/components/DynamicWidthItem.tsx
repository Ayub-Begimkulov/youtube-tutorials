import { useState } from "react";

interface DynamicWidthItemProps {
  text: string;
  color: string;
  nodeRef?: React.RefObject<HTMLDivElement>;
}

export function DynamicWidthItem({
  text,
  color,
  nodeRef,
}: DynamicWidthItemProps) {
  const [width, setWidth] = useState(300);

  const handleIncrementWidth = () => {
    setWidth((width) => Math.min(width + 50, 500));
  };

  const handleDecrementWidth = () => {
    setWidth((width) => Math.max(width - 50, 250));
  };

  return (
    <div
      ref={nodeRef}
      style={{
        width,
        height: 50,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderRadius: "6px",
      }}
    >
      {text}
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={handleIncrementWidth}>+ width</button>
        <button onClick={handleDecrementWidth}>- width</button>
      </div>
    </div>
  );
}
