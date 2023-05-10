import { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { modalRoot } from "./constants";

function useOutsideClick() {}

interface MenuProps {
  anchorRef: React.RefObject<HTMLElement | null>;
}

function Menu({ anchorRef }: MenuProps) {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const anchor = anchorRef.current;

    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();

    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -100%)",
        paddingBottom: 20,
      }}
    >
      Hello world
    </div>,
    modalRoot
  );
}

function MenuItem() {}

export const App = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ margin: 100 }}>
      <button ref={buttonRef}>Open modal</button>
      <Menu anchorRef={buttonRef} />
    </div>
  );
};
