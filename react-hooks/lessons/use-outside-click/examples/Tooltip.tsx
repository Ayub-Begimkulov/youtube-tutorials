import { useEffect, useRef, useState } from "react";
import { useEvent } from "../../use-ref/slides/use-event";

interface UseOutsideClickOptions {
  elementRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
  onOutsideClick(e: MouseEvent | TouchEvent): void;
}

function useOutsideClick({
  elementRef,
  triggerRef,
  enabled = true,
  onOutsideClick,
}: UseOutsideClickOptions) {
  const handleOutsideClick = useEvent(onOutsideClick);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    console.log("attach event listener");
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!elementRef.current) {
        return;
      }

      const ignoreElements = [elementRef.current];

      if (triggerRef?.current) {
        ignoreElements.push(triggerRef.current);
      }

      if (!ignoreElements.some((element) => element.contains(target))) {
        console.log("outside click");
        handleOutsideClick(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [enabled, elementRef, triggerRef, handleOutsideClick]);
}

interface TooltipProps {
  opened: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
  onClose: () => void;
}

function Tooltip({ opened, triggerRef, onClose }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    elementRef: tooltipRef,
    triggerRef,
    onOutsideClick: onClose,
    enabled: opened,
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

  const onClose = () => {
    setOpened(false);
  };

  return (
    <div className="tooltip-container">
      <Tooltip opened={opened} triggerRef={buttonRef} onClose={onClose} />
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
