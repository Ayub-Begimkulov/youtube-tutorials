import React from "react";

declare function useTransition(
  visible: boolean
): React.RefCallback<HTMLElement>;
declare function useCombinedRef<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<HTMLElement>;

interface TransitionProps {
  visible: boolean;
  name: string;
  children: (ref: (node: HTMLElement | null) => void) => React.ReactElement;
}

const Transition = ({ visible, children }: TransitionProps) => {
  const transitionRef = useTransition(visible);

  return children(transitionRef);
};

<Transition visible={true} name="test">
  {(ref) => <div ref={ref}>Test</div>}
</Transition>;

<Transition visible={true} name="test">
  {() => "Test"}
</Transition>;
