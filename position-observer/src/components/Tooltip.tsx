import { Portal } from "./Portal";

interface TooltipProps {
  nodeRef?: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
}

export function Tooltip({ nodeRef, position }: TooltipProps) {
  return (
    <Portal>
      <div
        ref={nodeRef}
        style={{
          position: "fixed",
          top: position.y + 7,
          left: position.x,
          background: "#535353",
          padding: "6px 8px",
          borderRadius: 4,
          color: "white",
        }}
      >
        <span
          style={{
            background: "#535353",
            width: 10,
            height: 10,
            display: "inline-block",
            position: "absolute",
            top: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />
        I'm a tooltip!
      </div>
    </Portal>
  );
}
