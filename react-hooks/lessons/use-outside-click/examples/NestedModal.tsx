import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { modalRoot } from "../constants";
import { useEvent } from "../../use-ref/slides/use-event";

class LayerManager {
  private children: LayerManager[] = [];
  private elementRef: React.RefObject<HTMLElement>;
  private triggerRef?: React.RefObject<HTMLElement>;

  constructor(
    elementRef: React.RefObject<HTMLElement>,
    triggerRef?: React.RefObject<HTMLElement>
  ) {
    this.elementRef = elementRef;
    this.triggerRef = triggerRef;
  }

  registerChild(child: LayerManager) {
    this.children.push(child);

    return () => {
      const index = this.children.indexOf(child);

      if (index === -1) {
        return;
      }

      this.children.splice(index, 1);
    };
  }

  isOutsideClick(target: EventTarget): boolean {
    if (!this.elementRef.current || !(target instanceof Node)) {
      return false;
    }

    const ignoreElements = [this.elementRef.current];

    if (this.triggerRef?.current) {
      ignoreElements.push(this.triggerRef.current);
    }

    const clickedInside = ignoreElements.some((element) =>
      element.contains(target)
    );

    if (clickedInside) {
      return false;
    }

    const clickOutsideOfChildLayers = this.children.every((child) =>
      child.isOutsideClick(target)
    );

    if (clickOutsideOfChildLayers) {
      return true;
    }

    return false;
  }
}

const LayerContext = createContext<LayerManager | null>(null);

interface UseLayerManagerProps {
  elementRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  onOutsideClick: VoidFunction;
}

function Layer({
  elementRef,
  triggerRef,
  onOutsideClick,
  children,
}: React.PropsWithChildren<UseLayerManagerProps>) {
  const parentLayer = useContext(LayerContext);
  const layer = useMemo(
    () => new LayerManager(elementRef, triggerRef),
    [elementRef, triggerRef]
  );
  const handleOutsideClick = useEvent(onOutsideClick);

  useEffect(() => {
    if (!parentLayer) {
      return;
    }

    return parentLayer.registerChild(layer);
  }, [parentLayer, layer]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (!e.target) {
        return;
      }

      if (layer.isOutsideClick(e.target)) {
        handleOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [layer]);

  return (
    <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
  );
}

function useLayerManager({
  elementRef,
  triggerRef,
  onOutsideClick,
}: UseLayerManagerProps) {
  function renderLayer(children: React.ReactNode) {
    return (
      <Layer
        elementRef={elementRef}
        triggerRef={triggerRef}
        onOutsideClick={onOutsideClick}
      >
        {children}
      </Layer>
    );
  }

  return { renderLayer };
}

function ButtonWithDropdown() {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const { renderLayer } = useLayerManager({
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
        renderLayer(
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
          )
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

  const { renderLayer } = useLayerManager({
    elementRef: modalRef,
    onOutsideClick: onClose,
  });
  // useOutsideClick({ elementRef: modalRef, onOutsideClick: onClose });

  if (!opened) {
    return null;
  }

  return renderLayer(
    ReactDOM.createPortal(
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
    )
  );
}

export function ModalExample() {
  const [opened, setOpened] = useState(false);

  const onClose = () => {
    setOpened(false);
    console.log("modal");
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
