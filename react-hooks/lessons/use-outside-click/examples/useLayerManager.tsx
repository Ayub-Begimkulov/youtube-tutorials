import { createContext, useContext, useMemo, useEffect } from "react";
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
      return true;
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
  outsideClickEnabled?: boolean;
  onOutsideClick: (event: MouseEvent | TouchEvent) => void;
}

export function useLayerManager({
  elementRef,
  triggerRef,
  outsideClickEnabled = true,
  onOutsideClick,
}: UseLayerManagerProps) {
  const layer = useMemo(
    () => new LayerManager(elementRef, triggerRef),
    [elementRef, triggerRef]
  );
  const parentLayer = useContext(LayerContext);

  useEffect(() => {
    if (!parentLayer) {
      return;
    }

    return parentLayer.registerChild(layer);
  }, [parentLayer, layer]);

  const handleOutsideClick = useEvent(onOutsideClick);

  useEffect(() => {
    if (!outsideClickEnabled) {
      return;
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (!e.target) {
        return;
      }

      if (layer.isOutsideClick(e.target)) {
        handleOutsideClick(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [layer, outsideClickEnabled]);

  function renderLayer(children: React.ReactNode) {
    return (
      <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
    );
  }

  return { renderLayer };
}
