export {};

function withHistory<Props extends { history?: Window["history"] }>(
  Component: React.ComponentType<Props>
) {
  function WrappedComponent(props: Omit<Props, "history">) {
    const componentProps = {
      ...props,
      history: window.history,
    } as Props;

    return <Component {...componentProps} />;
  }

  WrappedComponent.displayName = `withHistory(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}

withHistory;
