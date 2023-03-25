import React, { useRef } from "react";

declare function useTransition(
  visible: boolean
): React.RefCallback<HTMLElement>;
declare function useCombinedRef<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<HTMLElement>;

interface TransitionProps {
  elementRef: React.RefObject<HTMLElement> | React.RefCallback<HTMLElement>;
  visible: boolean;
  name: string;
  children: (ref: (node: HTMLElement | null) => void) => React.ReactElement;
}

const Transition = ({ elementRef, visible, children }: TransitionProps) => {
  const transitionRef = useTransition(visible);
  const combinedRef = useCombinedRef(elementRef, transitionRef);

  return children(combinedRef);
};

const ref = useRef<HTMLDivElement | null>(null);

<Transition elementRef={ref} visible={true} name="test">
  {(ref) => <div ref={ref}>Test</div>}
</Transition>;
