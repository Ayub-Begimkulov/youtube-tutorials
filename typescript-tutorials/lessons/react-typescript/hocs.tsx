import React from "react";

interface ComponentProps {
  history: Window["history"];
  onClick: React.MouseEventHandler;
}

const Component = ({ history, onClick }: ComponentProps) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(event);
    history.pushState(null, "", "/test");
  };

  return <div onClick={handleClick}>Click me</div>;
};

function withRouter<Props extends { history?: Window["history"] }>(
  Component: React.ComponentType<Props>
) {
  const WrappedComponent = (props: Omit<Props, "history">) => {
    const componentProps = {
      ...props,
      history: window.history,
    };

    return <Component {...(componentProps as Props)} />;
  };
  const name = Component.displayName || Component.name || "Component";
  WrappedComponent.displayName = `withRouter(${name})`;
  return WrappedComponent;
}

export const HOCComponent = withRouter(Component);
