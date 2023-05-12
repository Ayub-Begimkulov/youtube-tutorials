import { useRef, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";

interface TooltipProps {
  opened: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

function Tooltip({ opened, triggerRef, onClose }: TooltipProps) {
  const tooltipRef = useRef(null);

  useOutsideClick({
    elementRef: tooltipRef,
    triggerRef,
    onOutsideClick: onClose,
  });

  if (!opened) return null;

  return (
    <div ref={tooltipRef} className="tooltip">
      <div>Some Text</div>
    </div>
  );
}

export function TooltipExample() {
  const [opened, setOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  console.log("render", opened);

  const onClose = () => {
    setOpened(false);
  };

  return (
    <div className="tooltip-container">
      <Tooltip triggerRef={buttonRef} opened={opened} onClose={onClose} />
      <button
        ref={buttonRef}
        className="tooltip-trigger"
        onClick={() => {
          console.log("button click");
          setOpened((v) => !v);
        }}
      >
        Click to open tooltip
      </button>
    </div>
  );
}
