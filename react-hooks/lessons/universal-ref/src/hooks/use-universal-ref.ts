import { useCallback, useRef } from "react";

type RequiredRef<T> =
  | React.RefCallback<T | null>
  | React.MutableRefObject<T | null>;

type Ref<T> = RequiredRef<T> | null | undefined;

type UniversalRef<T> = {
  (element: T | null): void;
  (...refs: Ref<T>[]): (element: T | null) => void;
};

export function useUniversalRef<T>(originalRef: RequiredRef<T>) {
  const refsToUpdate = useRef<Ref<T>[] | null>(null);

  const callbackRefMerger = useCallback(
    (element: T | null) => {
      setRef(originalRef, element);
      refsToUpdate.current?.forEach((ref) => {
        setRef(ref, element);
      });
    },
    [originalRef]
  );

  const universalRef = useCallback(
    (...args: [T | null] | Ref<T>[]) => {
      if (args.length === 1 && !isRef(args[0])) {
        refsToUpdate.current = null;
        setRef(originalRef, args[0]);
        return;
      }

      refsToUpdate.current = args as Ref<T>[];
      return callbackRefMerger;
    },
    [callbackRefMerger, originalRef]
  ) as UniversalRef<T>;

  return universalRef;
}

function isRef(value: unknown): value is RequiredRef<unknown> {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null && "current" in value)
  );
}

function setRef<T>(ref: Ref<T>, value: T | null) {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

/* // USAGE
const universalRef = useUniversalRef((element) => {
  console.log(element);
});

const jsx1 = <div ref={universalRef} />;

const elementRef = useRef(null);

const jsx2 = <div ref={universalRef(elementRef)} />;
 */
