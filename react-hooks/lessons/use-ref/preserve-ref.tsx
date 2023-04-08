import { useEffect, useRef } from "react";

let previousRef: React.Ref<HTMLDivElement> | null = null;

function Component() {
  const ref = useRef<HTMLDivElement>(null);

  if (previousRef) {
    console.log("previousRef === ref", previousRef === ref);
  }

  previousRef = ref;

  useEffect(() => {
    console.log(ref);
  }, []);

  return <div ref={ref}>I'm a div</div>;
}

<Component />;
