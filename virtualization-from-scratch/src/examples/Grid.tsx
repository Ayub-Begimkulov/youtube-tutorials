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
- Горизонтальная виртуализация
- Горизонтальная виртуализация + замер
- Улучшения 
*/

type Key = string | number;

interface UseDynamicSizeGridProps {
  rowsCount: number;
  rowHeight?: (index: number) => number;
  estimateRowHeight?: (index: number) => number;
  getRowKey: (index: number) => Key;
  overscanY?: number;
  scrollingDelay?: number;
  getScrollElement: () => HTMLElement | null;
}

interface DynamicSizeGridRow {
  key: Key;
  index: number;
  offsetTop: number;
  height: number;
}

const DEFAULT_OVERSCAN_Y = 3;
const DEFAULT_SCROLLING_DELAY = 150;

function validateProps(props: UseDynamicSizeGridProps) {
  const { rowHeight, estimateRowHeight } = props;

  if (!rowHeight && !estimateRowHeight) {
    throw new Error(
      `you must pass either "rowHeight" or "estimateRowHeight" prop`
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

function useDynamicSizeGrid(props: UseDynamicSizeGridProps) {
  validateProps(props);

  const {
    rowHeight,
    estimateRowHeight,
    getRowKey,
    rowsCount,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    overscanY = DEFAULT_OVERSCAN_Y,
    getScrollElement,
  } = props;

  const [rowSizeCache, setRowSizeCache] = useState<Record<Key, number>>({});
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

  const { virtualRows, rowStartIndex, rowEndIndex, totalHeight, allRows } =
    useMemo(() => {
      const getRowHeight = (index: number) => {
        if (rowHeight) {
          return rowHeight(index);
        }

        const key = getRowKey(index);
        if (typeof rowSizeCache[key] === "number") {
          return rowSizeCache[key]!;
        }

        return estimateRowHeight!(index);
      };

      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + listHeight;

      let totalHeight = 0;
      let rowStartIndex = -1;
      let rowEndIndex = -1;
      const allRows: DynamicSizeGridRow[] = Array(rowsCount);

      for (let index = 0; index < rowsCount; index++) {
        const key = getRowKey(index);
        const row = {
          key,
          index: index,
          height: getRowHeight(index),
          offsetTop: totalHeight,
        };

        totalHeight += row.height;
        allRows[index] = row;

        if (rowStartIndex === -1 && row.offsetTop + row.height > rangeStart) {
          rowStartIndex = Math.max(0, index - overscanY);
        }

        if (rowEndIndex === -1 && row.offsetTop + row.height >= rangeEnd) {
          rowEndIndex = Math.min(rowsCount - 1, index + overscanY);
        }
      }

      const virtualRows = allRows.slice(rowStartIndex, rowEndIndex + 1);

      return {
        virtualRows,
        rowStartIndex,
        rowEndIndex,
        allRows,
        totalHeight,
      };
    }, [
      scrollTop,
      overscanY,
      listHeight,
      rowHeight,
      getRowKey,
      estimateRowHeight,
      rowSizeCache,
      rowsCount,
    ]);

  const latestData = useLatest({
    measurementCache: rowSizeCache,
    getRowKey,
    allRows,
    getScrollElement,
    scrollTop,
  });

  const measureRowInner = useCallback(
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

      const rowIndexAttribute = element.getAttribute("data-row-index") || "";
      const rowIndex = parseInt(rowIndexAttribute, 10);

      if (Number.isNaN(rowIndex)) {
        console.error(
          "dynamic rows must have a valid `data-row-index` attribute"
        );
        return;
      }
      const { measurementCache, getRowKey, allRows, scrollTop } =
        latestData.current;

      const key = getRowKey(rowIndex);
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

      const row = allRows[rowIndex]!;
      const delta = height - row.height;

      if (delta !== 0 && scrollTop > row.offsetTop) {
        const element = getScrollElement();
        if (element) {
          element.scrollBy(0, delta);
        }
      }

      setRowSizeCache((cache) => ({ ...cache, [key]: height }));
    },
    []
  );

  const itemsResizeObserver = useMemo(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        measureRowInner(entry.target, ro, entry);
      });
    });
    return ro;
  }, [latestData]);

  const measureRow = useCallback(
    (element: Element | null) => {
      measureRowInner(element, itemsResizeObserver);
    },
    [itemsResizeObserver]
  );

  return {
    virtualRows,
    totalHeight,
    rowStartIndex,
    rowEndIndex,
    isScrolling,
    allRows,
    measureRow,
  };
}

const gridSize = 100;

const createItems = () =>
  Array.from({ length: gridSize }, (_) => ({
    id: Math.random().toString(36).slice(2),
    columns: Array.from({ length: gridSize }, () => ({
      id: Math.random().toString(36).slice(2),
      text: faker.lorem.words({ min: 1, max: 4 }),
    })),
  }));

const containerHeight = 600;

export function Grid() {
  const [gridItems, setGridItems] = useState(createItems);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { virtualRows, totalHeight, measureRow } = useDynamicSizeGrid({
    estimateRowHeight: useCallback(() => 16, []),
    rowsCount: gridSize,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
    getRowKey: useCallback((index) => gridItems[index]!.id, [gridItems]),
  });

  const reverseGrid = () => {
    setGridItems((items) =>
      items
        .map((item) => ({
          ...item,
          columns: item.columns.slice().reverse(),
        }))
        .reverse()
    );
  };

  return (
    <div style={{ padding: "0 12px" }}>
      <h1>List</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={reverseGrid}>reverse</button>
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
          {virtualRows.map((virtualRow) => {
            const item = gridItems[virtualRow.index]!;

            return (
              <div
                key={item.id}
                data-row-index={virtualRow.index}
                ref={measureRow}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.offsetTop}px)`,
                  padding: "6px 12px",
                  display: "flex",
                }}
              >
                {virtualRow.index}
                {item.columns.map((col) => (
                  <div
                    style={{
                      width: 200,
                    }}
                    key={col.id}
                  >
                    {col.text}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
