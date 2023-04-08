export {};

function withHistory<Props extends { history?: Window["history"] }>(
  Component: React.ComponentType<Props>
) {
  function WrappedComponent(props: Omit<Props, "history">) {
    const componentProps = {
      ...props,
      history: window.history,
    };
    return <Component {...componentProps} />;
    //      ^^^^^^^^^
    //  'Omit<Props, "history"> & { history: History; }' is assignable to
    // the constraint of type 'Props', but 'Props' could be instantiated
    // with a different subtype of constraint '{ history?: History; }'.ts(2322)
  }

  WrappedComponent.displayName = `withHistory(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}

withHistory;
