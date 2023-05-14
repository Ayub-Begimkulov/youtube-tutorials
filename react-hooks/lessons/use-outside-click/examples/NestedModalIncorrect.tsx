import { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { modalRoot } from "../constants";
import { useOutsideClick } from "./useOutsideClick";

function ButtonWithDropdown() {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    elementRef: dropDownRef,
    triggerRef: buttonRef,
    onOutsideClick: () => {
      setOpened(false);
    },
  });

  useLayoutEffect(() => {
    if (!opened || !buttonRef.current) {
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: buttonRect.top + buttonRect.height,
      left: buttonRect.left,
      width: buttonRect.width,
    });
  }, [opened]);

  return (
    <>
      <button ref={buttonRef} onClick={() => setOpened(true)}>
        Open Dropdown
      </button>
      {opened &&
        ReactDOM.createPortal(
          <div
            ref={dropDownRef}
            style={{
              position: "absolute",
              ...position,
              padding: 12,
              background: "#212121",
              borderRadius: 8,
            }}
          >
            <div>A</div>
            <div>B</div>
          </div>,
          modalRoot
        )}
    </>
  );
}

interface ModalProps {
  opened: boolean;
  onClose: () => void;
}

function Modal({ opened, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    elementRef: modalRef,
    onOutsideClick: onClose,
  });

  if (!opened) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate3d(-50%, -50%, 0)",
        width: 400,
        height: 300,
        background: "#515151",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ButtonWithDropdown />
    </div>,
    modalRoot
  );
}

export function ModalExample() {
  const [opened, setOpened] = useState(false);

  const onClose = () => {
    setOpened(false);
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} />
      <button
        className="tooltip-trigger"
        onClick={() => {
          setOpened((v) => !v);
        }}
      >
        Click to open modal
      </button>
    </>
  );
}
