import { observeMove as observeIntersection } from "./observeMove";

export function observeMoveFull(
  element: HTMLElement,
  onMove: (rect: DOMRect) => void
) {
  const disconnectIntersection = observeIntersection(element, onMove);
  const disconnectResize = observeResize(element, onMove);
  const unsubscribeFromScroll = listenToScrollEvents(element, onMove);

  return () => {
    disconnectIntersection();
    disconnectResize();
    unsubscribeFromScroll();
  };
}

function observeResize(element: HTMLElement, onMove: (rect: DOMRect) => void) {
  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    onMove(element.getBoundingClientRect());
  });
  resizeObserver.observe(element);

  return () => {
    resizeObserver.disconnect();
  };
}

function listenToScrollEvents(
  element: HTMLElement,
  onMove: (rect: DOMRectReadOnly) => void
) {
  const parents: EventTarget[] = [window];
  let current = element;

  while (current.parentElement) {
    parents.push(current.parentElement);
    current = current.parentElement;
  }

  const handleScroll = () => {
    onMove(element.getBoundingClientRect());
  };

  parents.forEach((parentEl) => {
    parentEl.addEventListener("scroll", handleScroll, { passive: true });
  });

  return () => {
    parents.forEach((parentEl) => {
      parentEl.removeEventListener("scroll", handleScroll);
    });
  };
}
