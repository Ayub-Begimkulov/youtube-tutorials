function TestComponent() {
  const resizeRef = useResizeObserver(() => {
    console.log("resize");
  });

  return <div ref={resizeRef}>Resize me</div>;
}

function TestComponentWithRef() {
  const resizeRef = useResizeObserver(() => {
    console.log("resize");
  });

  const elementRef = useRef(null);

  return <div ref={resizeRef(elementRef)}>Resize me</div>;
}

function TestComponentWithRef2() {
  const resizeRef = useResizeObserver(() => {
    console.log("resize");
  });

  const elementRef = useRef(null);
  const elementRef2 = useRef(null);

  return <div ref={resizeRef(elementRef, elementRef2)}>Resize me</div>;
}
