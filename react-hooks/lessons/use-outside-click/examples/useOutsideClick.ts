import { useEffect } from "react";
import { useEvent } from "../../use-ref/slides/use-event";

interface UseOutsideClickOptions {
  elementRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
  onOutsideClick(event: MouseEvent | TouchEvent): void;
}

export function useOutsideClick({
  elementRef,
  triggerRef,
  enabled = true,
  onOutsideClick,
}: UseOutsideClickOptions) {
  const eventHandler = useEvent(onOutsideClick);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (!elementRef.current || !(target instanceof Node)) {
        return;
      }

      const ignoreElements = [elementRef.current];

      if (triggerRef?.current instanceof HTMLElement) {
        ignoreElements.push(triggerRef.current);
      }

      if (!ignoreElements.some((item) => item.contains(target))) {
        eventHandler(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [elementRef, triggerRef, enabled, eventHandler]);
}
