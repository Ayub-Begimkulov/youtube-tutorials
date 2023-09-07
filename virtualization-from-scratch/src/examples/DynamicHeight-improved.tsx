import { faker } from "@faker-js/faker";
import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/*
Фичи:
- размер контейнера [done]
- разный размер элементов списка [done]
- динамический замер элементов списка [done] 
- отслеживание элементов через resizeObserver [done]
- корректировка скролла (станет ясно в конце) [done]
*/

const createItems = () =>
  Array.from({ length: 10_000 }, (_) => ({
    id: Math.random().toString(36).slice(2),
    text: faker.lorem.paragraphs({
      min: 3,
      max: 6,
    }),
  }));

type Key = string | number;

interface UseDynamicSizeListProps {
  itemsCount: number;
  itemHeight?: (index: number) => number;
  estimateItemHeight?: (index: number) => number;
  getItemKey: (index: number) => Key;
  overscan?: number;
  scrollingDelay?: number;
  getScrollElement: () => HTMLElement | null;
}

interface DynamicSizeListItem {
  key: Key;
  index: number;
  offsetTop: number;
  height: number;
}

const DEFAULT_OVERSCAN = 3;
const DEFAULT_SCROLLING_DELAY = 150;

function validateProps(props: UseDynamicSizeListProps) {
  const { itemHeight, estimateItemHeight } = props;

  if (!itemHeight && !estimateItemHeight) {
    throw new Error(
      `you must pass either "itemHeight" or "estimateItemHeight" prop`
    );
  }
}

function useLatest<T>(value: T) {
  const valueRef = useRef(value);
  useInsertionEffect(() => {
    valueRef.current = value;
  });
  return valueRef;
}

function useDynamicSizeList(props: UseDynamicSizeListProps) {
  validateProps(props);

  const {
    itemHeight,
    estimateItemHeight,
    getItemKey,
    itemsCount,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    overscan = DEFAULT_OVERSCAN,
    getScrollElement,
  } = props;

  const [measurementCache, setMeasurementCache] = useState<Record<Key, number>>(
    {}
  );
  const [listHeight, setListHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useLayoutEffect(() => {
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const height =
        entry.borderBoxSize[0]?.blockSize ??
        entry.target.getBoundingClientRect().height;

      setListHeight(height);
    });

    resizeObserver.observe(scrollElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [getScrollElement]);

  useLayoutEffect(() => {
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;

      setScrollTop(scrollTop);
    };

    handleScroll();

    scrollElement.addEventListener("scroll", handleScroll);

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [getScrollElement]);

  useEffect(() => {
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return;
    }

    let timeoutId: number | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
      }
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [getScrollElement]);

  const { virtualItems, startIndex, endIndex, totalHeight, allItems } =
    useMemo(() => {
      const getItemHeight = (index: number) => {
        if (itemHeight) {
          return itemHeight(index);
        }

        const key = getItemKey(index);
        if (typeof measurementCache[key] === "number") {
          return measurementCache[key]!;
        }

        return estimateItemHeight!(index);
      };

      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + listHeight;

      let totalHeight = 0;
      let startIndex = -1;
      let endIndex = -1;
      const allRows: DynamicSizeListItem[] = Array(itemsCount);

      for (let index = 0; index < itemsCount; index++) {
        const key = getItemKey(index);
        const row = {
          key,
          index: index,
          height: getItemHeight(index),
          offsetTop: totalHeight,
        };

        totalHeight += row.height;
        allRows[index] = row;

        if (startIndex === -1 && row.offsetTop + row.height > rangeStart) {
          startIndex = Math.max(0, index - overscan);
        }

        if (endIndex === -1 && row.offsetTop + row.height >= rangeEnd) {
          endIndex = Math.min(itemsCount - 1, index + overscan);
        }
      }

      const virtualRows = allRows.slice(startIndex, endIndex + 1);

      return {
        virtualItems: virtualRows,
        startIndex,
        endIndex,
        allItems: allRows,
        totalHeight,
      };
    }, [
      scrollTop,
      overscan,
      listHeight,
      itemHeight,
      getItemKey,
      estimateItemHeight,
      measurementCache,
      itemsCount,
    ]);

  const latestData = useLatest({
    measurementCache,
    getItemKey,
    allItems,
    getScrollElement,
    scrollTop,
  });

  const measureElementInner = useCallback(
    (
      element: Element | null,
      resizeObserver: ResizeObserver,
      entry?: ResizeObserverEntry
    ) => {
      if (!element) {
        return;
      }

      if (!element.isConnected) {
        resizeObserver.unobserve(element);
        return;
      }

      const indexAttribute = element.getAttribute("data-index") || "";
      const index = parseInt(indexAttribute, 10);

      if (Number.isNaN(index)) {
        console.error(
          "dynamic elements must have a valid `data-index` attribute"
        );
        return;
      }
      const { measurementCache, getItemKey, allItems, scrollTop } =
        latestData.current;

      const key = getItemKey(index);
      const isResize = Boolean(entry);

      resizeObserver.observe(element);

      if (!isResize && typeof measurementCache[key] === "number") {
        return;
      }

      const height =
        entry?.borderBoxSize[0]?.blockSize ??
        element.getBoundingClientRect().height;

      if (measurementCache[key] === height) {
        return;
      }

      const item = allItems[index]!;
      const delta = height - item.height;

      if (delta !== 0 && scrollTop > item.offsetTop) {
        const element = getScrollElement();
        if (element) {
          element.scrollBy(0, delta);
        }
      }

      setMeasurementCache((cache) => ({ ...cache, [key]: height }));
    },
    []
  );

  const itemsResizeObserver = useMemo(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        measureElementInner(entry.target, ro, entry);
      });
    });
    return ro;
  }, [latestData]);

  const measureElement = useCallback(
    (element: Element | null) => {
      measureElementInner(element, itemsResizeObserver);
    },
    [itemsResizeObserver]
  );

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    isScrolling,
    allItems,
    measureElement,
  };
}

const containerHeight = 600;

export function DynamicHeight() {
  const [listItems, setListItems] = useState(createItems);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, measureElement } = useDynamicSizeList({
    estimateItemHeight: useCallback(() => 16, []),
    itemsCount: listItems.length,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
    getItemKey: useCallback((index) => listItems[index]!.id, [listItems]),
  });

  return (
    <div style={{ padding: "0 12px" }}>
      <h1>List</h1>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setListItems((items) => items.slice().reverse())}
        >
          reverse
        </button>
      </div>
      <div
        ref={scrollElementRef}
        style={{
          height: containerHeight,
          overflow: "auto",
          border: "1px solid lightgrey",
          position: "relative",
        }}
      >
        <div style={{ height: totalHeight }}>
          {virtualItems.map((virtualItem) => {
            const item = listItems[virtualItem.index]!;

            return (
              <div
                key={item.id}
                data-index={virtualItem.index}
                ref={measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualItem.offsetTop}px)`,
                  padding: "6px 12px",
                }}
              >
                {virtualItem.index} {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
