import { useState } from "react";

interface TooltipProps {
  opened: boolean;
  onClose: () => void;
}

function Tooltip({ opened }: TooltipProps) {
  if (!opened) return null;

  return (
    <div className="tooltip">
      <div>Some Text</div>
    </div>
  );
}

export function TooltipExample() {
  const [opened, setOpened] = useState(false);

  const onClose = () => {
    setOpened(false);
  };

  return (
    <div className="tooltip-container">
      <Tooltip opened={opened} onClose={onClose} />
      <button
        className="tooltip-trigger"
        onClick={() => {
          setOpened((v) => !v);
        }}
      >
        Click to open tooltip
      </button>
    </div>
  );
}
