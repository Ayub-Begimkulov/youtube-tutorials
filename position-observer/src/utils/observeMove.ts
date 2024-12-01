export function observeMove(
  element: HTMLElement,
  onMove: (rect: DOMRect) => void
) {
  const root = document.documentElement;

  let intersectionObserver: IntersectionObserver | null;

  function disconnect() {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    intersectionObserver = null;
  }

  function refresh() {
    disconnect();

    const elementRect = element.getBoundingClientRect();

    onMove(elementRect);

    const rootMargin = [
      Math.floor(elementRect.top), // top
      Math.floor(root.clientWidth - elementRect.right), // right
      Math.floor(root.clientHeight - elementRect.bottom), // bottom
      Math.floor(elementRect.left), // left
    ]
      .map((value) => `${-Math.floor(value)}px`)
      .join(" ");

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) {
          return;
        }

        const ratio = entry.intersectionRatio;

        if (ratio < 1) {
          refresh();
        }
      },
      {
        root: root.ownerDocument,
        rootMargin,
        threshold: 1,
      }
    );

    intersectionObserver.observe(element);
  }

  refresh();

  return disconnect;
}
