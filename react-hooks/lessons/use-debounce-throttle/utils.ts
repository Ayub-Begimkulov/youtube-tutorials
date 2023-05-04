export function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
  let rafId: number | null = null;

  function throttled(...args: Parameters<T>) {
    if (typeof rafId === "number") {
      console.log("cancel");
      return;
    }

    rafId = requestAnimationFrame(() => {
      fn.apply(null, args);
      rafId = null;
    });
  }

  throttled.cancel = () => {
    if (typeof rafId !== "number") {
      return;
    }
    cancelAnimationFrame(rafId);
  };

  return throttled;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timeoutId: number | null = null;

  function debounced(...args: Parameters<T>) {
    if (typeof timeoutId === "number") {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(null, args);
    }, ms);
  }

  debounced.cancel = () => {
    if (typeof timeoutId !== "number") {
      return;
    }
    clearTimeout(timeoutId);
  };

  return debounced;
}
