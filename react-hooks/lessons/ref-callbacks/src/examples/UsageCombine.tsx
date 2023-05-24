import { useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const combinedInputRef = useCombinedRef(ref, inputRef);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    console.log(inputRef.current.getBoundingClientRect());
  }, []);

  return <input {...props} ref={combinedInputRef} />;
});

export function UsageCombine() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <Input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </div>
  );
}
