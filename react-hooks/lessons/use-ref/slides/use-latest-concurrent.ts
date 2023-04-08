import { useLayoutEffect, useRef } from "react";

export function useLatest<Value>(value: Value) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  });

  return valueRef;
}
