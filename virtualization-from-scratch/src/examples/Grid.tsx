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
- горизонтальная виртуализация
- замер ширины колонок
*/

const items = Array.from({ length: 10_000 }, (_) => ({
  id: Math.random().toString(36).slice(2),
  text: faker.lorem.paragraphs({
    min: 3,
    max: 6,
  }),
}));

type Key = string | number;

interface UseDynamicSizeListProps {
  rowsCount: number;
  columnsCount: number;
  rowHeight?: (index: number) => number;
  estimateRowHeight?: (index: number) => number;
  columnWidth?: (index: number) => number;
  estimateColumnWidth?: (index: number) => number;
  getItemKey: (index: number) => Key;
  overscanX?: number;
  overscanY?: number;
  scrollingDelay?: number;
  getScrollElement: () => HTMLElement | null;
}

interface VirtualRow {
  key: Key;
  index: number;
  offsetTop: number;
  height: number;
}

interface VirtualColumn {
  key: Key;
  index: number;
  offsetLeft: number;
  width: number;
}

const DEFAULT_OVERSCAN_X = 3;
const DEFAULT_OVERSCAN_Y = 1;
const DEFAULT_SCROLLING_DELAY = 150;

function validateProps(props: UseDynamicSizeListProps) {
  const { rowHeight, estimateRowHeight, columnWidth, estimateColumnWidth } =
    props;

  if (!rowHeight && !estimateRowHeight) {
    throw new Error(
      `you must pass either "rowHeight" or "estimateRowHeight" prop`
    );
  }

  if (!columnWidth && !estimateColumnWidth) {
    throw new Error(
      `you must pass either "columnWidth" or "estimateColumnWidth" prop`
    );
  }

  if (!columnWidth && !rowHeight) {
    throw new Error(`you must pass either "columnWidth" or "rowHeight" prop`);
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
    rowHeight,
    estimateRowHeight,
    columnWidth,
    estimateColumnWidth,
    getItemKey,
    rowsCount,
    columnsCount,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    overscanX = DEFAULT_OVERSCAN_X,
    overscanY = DEFAULT_OVERSCAN_Y,
    getScrollElement,
  } = props;

  const [measurementCache, setMeasurementCache] = useState<Record<Key, number>>(
    {}
  );
  // TODO not correct
  const [columnsCache, setColumnsCache] = useState<
    Record<Key, Record<number, number>>
  >({});

  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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
      const size = entry.borderBoxSize[0]
        ? {
            width: entry.borderBoxSize[0].inlineSize,
            height: entry.borderBoxSize[0].blockSize,
          }
        : entry.target.getBoundingClientRect();

      setListHeight(size.height);
      setListWidth(size.width);
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
      const { scrollTop, scrollLeft } = scrollElement;

      setScrollTop(scrollTop);
      setScrollLeft(scrollLeft);
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

  const { virtualRows, allRows, rowStartIndex, rowEndIndex, totalHeight } =
    useMemo(() => {
      const getItemHeight = (index: number) => {
        if (rowHeight) {
          return rowHeight(index);
        }

        const key = getItemKey(index);
        if (typeof measurementCache[key] === "number") {
          return measurementCache[key]!;
        }

        return estimateRowHeight!(index);
      };

      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + listHeight;

      let totalHeight = 0;
      let startIndex = -1;
      let endIndex = -1;
      const allRows: VirtualRow[] = Array(rowsCount);

      for (let index = 0; index < rowsCount; index++) {
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
          startIndex = Math.max(0, index - overscanX);
        }

        if (endIndex === -1 && row.offsetTop + row.height >= rangeEnd) {
          endIndex = Math.min(rowsCount - 1, index + overscanX);
        }
      }

      const virtualRows = allRows.slice(startIndex, endIndex + 1);

      return {
        virtualRows,
        allRows,
        rowStartIndex: startIndex,
        rowEndIndex: endIndex,
        totalHeight,
      };
    }, [
      scrollTop,
      overscanX,
      listHeight,
      rowHeight,
      getItemKey,
      estimateRowHeight,
      measurementCache,
      rowsCount,
    ]);

  const {
    virtualColumns,
    allColumns,
    columnStartIndex,
    columnEndIndex,
    totalWidth,
  } = useMemo(() => {
    const getColumnWidth = (index: number) => {
      if (columnWidth) {
        return columnWidth(index);
      }

      const key = getItemKey(index);
      if (columnsCache[key]) {
        const cache = columnsCache[key]!;
      }

      return estimateColumnWidth!(index);
    };

    const rangeStart = scrollLeft;
    const rangeEnd = scrollLeft + listWidth;

    let totalWidth = 0;
    let startIndex = -1;
    let endIndex = -1;
    const allColumns: VirtualColumn[] = Array(rowsCount);

    for (let index = 0; index < rowsCount; index++) {
      const key = getItemKey(index);
      const row = {
        key,
        index: index,
        width: getColumnWidth(index),
        offsetLeft: totalWidth,
      };

      totalWidth += row.width;
      allColumns[index] = row;

      if (startIndex === -1 && row.offsetLeft + row.width > rangeStart) {
        startIndex = Math.max(0, index - overscanX);
      }

      if (endIndex === -1 && row.offsetLeft + row.width >= rangeEnd) {
        endIndex = Math.min(rowsCount - 1, index + overscanX);
      }
    }

    const virtualColumns = allColumns.slice(startIndex, endIndex + 1);

    return {
      virtualColumns,
      allColumns,
      columnStartIndex: startIndex,
      columnEndIndex: endIndex,
      totalWidth,
    };
  }, [
    scrollTop,
    overscanX,
    listHeight,
    rowHeight,
    getItemKey,
    estimateRowHeight,
    measurementCache,
    rowsCount,
  ]);

  const latestData = useLatest({
    measurementCache,
    getItemKey,
    allItems: allRows,
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
    virtualItems: virtualRows,
    totalHeight,
    startIndex: rowStartIndex,
    endIndex: rowEndIndex,
    isScrolling,
    allItems: allRows,
    measureElement,
  };
}

const containerHeight = 600;

export function DynamicHeight() {
  const [listItems, setListItems] = useState(items);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, measureElement } = useDynamicSizeList({
    estimateRowHeight: useCallback(() => 16, []),
    rowsCount: listItems.length,
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
