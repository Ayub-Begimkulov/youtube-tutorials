import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  const prevValue = useRef<T | null>(null);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue;
}
