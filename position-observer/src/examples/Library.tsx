import { autoUpdate } from "@floating-ui/dom";
import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { DynamicWidthItem } from "../components/DynamicWidthItem";
import { ExampleWrapper } from "../components/ExampleWrapper";
import { Tooltip } from "../components/Tooltip";

export function Library() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const button = anchorRef.current;
    const tooltip = tooltipRef.current;

    if (!button || !tooltip) {
      return;
    }

    let isFirst = true;

    return autoUpdate(button, tooltip, () => {
      const buttonPosition = button.getBoundingClientRect();
      const newPosition = {
        x: buttonPosition.left,
        y: buttonPosition.bottom,
      };

      if (isFirst) {
        // do not run flushSync on the first update
        // since our callback will be called immediately
        // and it's not allowed to call flushSync in
        // lifecycle methods
        setPosition(newPosition);
        isFirst = false;
      } else {
        flushSync(() => {
          setPosition(newPosition);
        });
      }
    });
  }, []);

  return (
    <ExampleWrapper>
      <DynamicWidthItem color="red" text="dynamic neighbor" />
      <DynamicWidthItem
        nodeRef={anchorRef}
        color="green"
        text="anchor element"
      />

      <Tooltip nodeRef={tooltipRef} position={position} />
    </ExampleWrapper>
  );
}
