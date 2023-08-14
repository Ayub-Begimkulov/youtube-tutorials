import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";

const items = Array.from({ length: 1_000 }, () => ({
  id: Math.random().toString(36).slice(2),
  text: faker.lorem.text(),
}));
const itemHeight = 40;
const containerHeight = 800;

export const DynamicHeight = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [keyToSizeMap, setKeyToSizeMap] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    setScrollOffset(scrollContainer.scrollTop);

    const handleScroll = () => {
      setScrollOffset(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const [itemsToRender, totalHeight] = useMemo(() => {
    const renderRangeStart = scrollOffset;
    const renderRangeEnd = scrollOffset + containerHeight;

    const itemsToRender = [];
    let offsetTop = 0;

    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i]!;
      const size = keyToSizeMap[item.id] ?? itemHeight;
      const currentOffset = offsetTop;

      offsetTop += size;

      if (
        currentOffset + size > renderRangeStart &&
        currentOffset < renderRangeEnd
      ) {
        itemsToRender.push({
          ...item,
          offsetTop: currentOffset,
          size,
        });
      }
    }

    return [itemsToRender, offsetTop];
  }, [keyToSizeMap, scrollOffset]);

  const measureRef = useCallback((element: Element | null) => {
    if (!element) {
      return;
    }

    const key = element.getAttribute("data-key");

    if (!key) {
      return;
    }

    setKeyToSizeMap((prevSizes) => {
      if (typeof prevSizes[key] === "number") {
        return prevSizes;
      }

      const elementSize = element.getBoundingClientRect();

      return {
        ...prevSizes,
        [key]: elementSize.height,
      };
    });
  }, []);

  return (
    <div style={{ height: "100%", padding: 12 }}>
      <h1>Table</h1>

      <div
        ref={scrollContainerRef}
        style={{
          height: containerHeight,
          position: "relative",
          overflow: "auto",
        }}
      >
        <div style={{ height: totalHeight }}>
          {itemsToRender.map((item) => {
            return (
              <div
                key={item.id}
                style={{
                  height: item.size,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateY(${item.offsetTop}px)`,
                }}
              >
                <div ref={measureRef} data-key={item.id}>
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
