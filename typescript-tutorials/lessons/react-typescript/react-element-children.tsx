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
  children: React.ReactElement;
}

const Transition = ({ visible, children }: TransitionProps) => {
  const transitionRef = useTransition(visible);
  const elementRef = useCombinedRef(transitionRef, children.props.ref);

  return React.cloneElement(children, { ref: elementRef });
};

<Transition visible={true} name="test">
  <div>Test</div>
</Transition>;

<Transition visible={true} name="test">
  Test
</Transition>;

<Transition visible={true} name="test">
  <div></div>
  <div></div>
</Transition>;

// ==========

const Component = () => {
  return <div>Test</div>;
};

<Transition visible={true} name="test">
  <Component />
</Transition>;
