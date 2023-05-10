import { useEffect, useRef, useState } from "react";
import { useEvent } from "../hooks/use-event";

function useOutsideClick(
  elementRef: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  attached = true
) {
  const eventHandler = useEvent(handler);

  useEffect(() => {
    if (!attached) return;

    console.log("attach event listener ");

    const handleClick = (e: MouseEvent) => {
      if (!elementRef.current) return;

      console.log("outside click");

      if (e.target instanceof Node && !elementRef.current.contains(e.target)) {
        eventHandler(e);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [elementRef, eventHandler, attached]);
}

interface TooltipProps {
  opened: boolean;
  onClose: () => void;
}

function Tooltip({ opened, onClose }: TooltipProps) {
  const tooltipRef = useRef(null);

  useOutsideClick(tooltipRef, onClose, opened);

  console.log("render tooltip, isOpened = ", opened);

  if (!opened) return null;

  return (
    <div ref={tooltipRef} className="tooltip">
      <div>Some Text</div>
    </div>
  );
}

export function OutsideClick() {
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
          console.log("button click");
          queueMicrotask(() => {
            console.log("microtask before update");
          });
          setOpened((v) => !v);
          queueMicrotask(() => {
            console.log("microtask after update");
          });
        }}
      >
        Click to open tooltip
      </button>
    </div>
  );
}
