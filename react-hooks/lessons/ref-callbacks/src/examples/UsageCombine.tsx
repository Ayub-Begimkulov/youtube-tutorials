import { useRef } from "react";
import { forwardRef, useCallback } from "react";

type RefItem<T> =
  | ((element: T | null) => void)
  | React.MutableRefObject<T | null>
  | null
  | undefined;

function useCombinedRef<T>(...refs: RefItem<T>[]) {
  const refCb = useCallback((element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element;
      }
    });
  }, refs);

  return refCb;
}

interface InputProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input = forwardRef(function Input(
  props: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return <input {...props} ref={ref} />;
});

export function UsageCombine() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <Input />
      <button onClick={focus}>Focus</button>
    </div>
  );
}
