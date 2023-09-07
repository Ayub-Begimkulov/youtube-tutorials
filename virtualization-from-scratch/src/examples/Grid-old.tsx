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

type Key = string | number;

interface UseDynamicSizeListProps {
  rowsCount: number;
  columnsCount: number;
  rowHeight?: (index: number) => number;
  estimateRowHeight?: (index: number) => number;
  columnWidth?: (index: number) => number;
  estimateColumnWidth?: (index: number) => number;
  getRowKey: (index: number) => Key;
  getColumnKey: (index: number) => Key;
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

const DEFAULT_OVERSCAN_X = 1;
const DEFAULT_OVERSCAN_Y = 3;
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
    getRowKey,
    getColumnKey,
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
  const [cellWidthCache, setCellWidthCache] = useState<Record<string, number>>(
    {}
  );
  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const columnsWidth = useMemo(() => {
    if (columnWidth) {
      return Array.from({ length: columnsCount }, (_, index) =>
        columnWidth(index)
      );
    }

    const widthsArray: number[] = Array(columnsCount);

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      let columnMeasuredWidth: undefined | number = undefined;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const cellCacheKey = `${getRowKey(rowIndex)}-${getColumnKey(
          columnIndex
        )}`;
        const measuredCellWidth = cellWidthCache[cellCacheKey];

        if (typeof measuredCellWidth === "number") {
          columnMeasuredWidth =
            typeof columnMeasuredWidth === "number"
              ? Math.max(measuredCellWidth, columnMeasuredWidth)
              : measuredCellWidth;
        }
      }

      widthsArray[columnIndex] =
        columnMeasuredWidth ?? estimateColumnWidth?.(columnIndex) ?? 0;
    }

    return widthsArray;
  }, [
    cellWidthCache,
    rowsCount,
    columnsCount,
    estimateColumnWidth,
    columnWidth,
    getColumnKey,
    getRowKey,
  ]);

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
      const getRowHeight = (index: number) => {
        if (rowHeight) {
          return rowHeight(index);
        }

        const key = getRowKey(index);
        if (typeof measurementCache[key] === "number") {
          return measurementCache[key]!;
        }

        return estimateRowHeight!(index);
      };

      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + listHeight;

      let totalHeight = 0;
      let rowStartIndex = 0;
      let rowEndIndex = 0;
      const allRows: VirtualRow[] = Array(rowsCount);

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

        if (row.offsetTop + row.height < rangeStart) {
          rowStartIndex++;
        }

        if (row.offsetTop + row.height < rangeEnd) {
          rowEndIndex++;
        }
      }

      rowStartIndex = Math.max(0, rowStartIndex - overscanY);
      rowEndIndex = Math.min(rowsCount - 1, rowEndIndex + overscanY);

      const virtualRows = allRows.slice(rowStartIndex, rowEndIndex + 1);

      return {
        virtualRows,
        allRows,
        rowStartIndex,
        rowEndIndex,
        totalHeight,
      };
    }, [
      scrollTop,
      overscanY,
      listHeight,
      rowHeight,
      getRowKey,
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
    const rangeStart = scrollLeft;
    const rangeEnd = scrollLeft + listWidth;

    let totalWidth = 0;
    let columnStartIndex = 0;
    let columnEndIndex = 0;
    const allColumns: VirtualColumn[] = Array(columnsCount);

    for (let index = 0; index < columnsCount; index++) {
      const column = {
        key: getColumnKey(index),
        index: index,
        width: columnsWidth[index]!,
        offsetLeft: totalWidth,
      };

      totalWidth += column.width;
      allColumns[index] = column;

      if (column.offsetLeft + column.width < rangeStart) {
        columnStartIndex++;
      }

      if (column.offsetLeft + column.width < rangeEnd) {
        columnEndIndex++;
      }
    }

    columnStartIndex = Math.max(0, columnStartIndex - overscanX);
    columnEndIndex = Math.min(columnsCount - 1, columnEndIndex + overscanX);

    const virtualColumns = allColumns.slice(
      columnStartIndex,
      columnEndIndex + 1
    );

    return {
      virtualColumns,
      allColumns,
      columnStartIndex,
      columnEndIndex,
      totalWidth,
    };
  }, [
    scrollLeft,
    overscanX,
    listWidth,
    getColumnKey,
    estimateColumnWidth,
    columnsWidth,
    columnsCount,
  ]);

  const latestData = useLatest({
    measurementCache,
    getRowKey,
    getColumnKey,
    allItems: allRows,
    getScrollElement,
    scrollTop,
    cellWidthCache,
    allColumns,
    scrollLeft,
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

      const indexAttribute = element.getAttribute("data-index") || "";
      const index = parseInt(indexAttribute, 10);

      if (Number.isNaN(index)) {
        console.error("dynamic rows must have a valid `data-index` attribute");
        return;
      }
      const { measurementCache, getRowKey, allItems, scrollTop } =
        latestData.current;

      const key = getRowKey(index);
      const isResize = Boolean(entry);

      resizeObserver.observe(element);

      if (!isResize && typeof measurementCache[key] === "number") {
        return;
      }

      const height = Math.ceil(
        entry?.borderBoxSize[0]?.blockSize ??
          element.getBoundingClientRect().height
      );
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
    [latestData]
  );

  const itemsResizeObserver = useMemo(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        measureRowInner(entry.target, ro, entry);
      });
    });
    return ro;
  }, []);

  const measureRow = useCallback(
    (element: Element | null) => {
      measureRowInner(element, itemsResizeObserver);
    },
    [itemsResizeObserver]
  );

  const measureColumnInner = useCallback(
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

      const columnIndexAttribute =
        element.getAttribute("data-column-index") || "";
      const columnIndex = parseInt(columnIndexAttribute, 10);

      if (Number.isNaN(rowIndex) || Number.isNaN(columnIndex)) {
        console.error(
          "dynamic columns must have a valid `data-row-index` and `data-column-index` attributes"
        );
        return;
      }

      const {
        cellWidthCache,
        allColumns,
        scrollLeft,
        getRowKey,
        getColumnKey,
      } = latestData.current;

      const key = `${getRowKey(rowIndex)}-${getColumnKey(columnIndex)}`;
      const isResize = Boolean(entry);
      resizeObserver.observe(element);

      if (!isResize && typeof cellWidthCache[key] === "number") {
        return;
      }

      const width = Math.ceil(
        entry?.borderBoxSize[0]?.inlineSize ??
          element.getBoundingClientRect().width
      );

      if (cellWidthCache[key] === width) {
        return;
      }

      const item = allColumns[columnIndex]!;
      const delta = width - item.width;

      if (delta !== 0 && item.offsetLeft < scrollLeft) {
        const element = getScrollElement();
        if (element) {
          element.scrollBy(delta, 0);
        }
      }

      setCellWidthCache((cache) => ({ ...cache, [key]: width }));
    },
    [latestData]
  );

  const columnResizeObserver = useMemo(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        measureColumnInner(entry.target, ro, entry);
      });
    });
    return ro;
  }, []);

  const measureColumn = useCallback(
    (element: Element | null) => {
      measureColumnInner(element, columnResizeObserver);
    },
    [measureColumnInner, columnResizeObserver]
  );

  return {
    virtualRows,
    totalHeight,
    rowStartIndex,
    rowEndIndex,
    isScrolling,
    allRows,
    measureRow,
    measureColumn,
    virtualColumns,
    allColumns,
    columnStartIndex,
    columnEndIndex,
    totalWidth,
  };
}

const createItems = () =>
  Array.from({ length: 1_000 }, (_) => ({
    id: Math.random().toString(36).slice(2),
    text: faker.lorem.text(),
  }));

const containerHeight = 600;

export function Grid() {
  const [listItems, setListItems] = useState(createItems);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const {
    virtualRows,
    virtualColumns,
    totalHeight,
    totalWidth,
    measureColumn,
  } = useDynamicSizeList({
    rowHeight: useCallback(() => 30, []),
    rowsCount: 1,
    estimateColumnWidth: useCallback(() => 100, []),
    columnsCount: listItems.length,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
    getRowKey: useCallback((index) => listItems[index]!.id, [listItems]),
    getColumnKey: useCallback((index) => listItems[index]!.id, [listItems]),
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
        <div style={{ height: totalHeight, width: totalWidth }}>
          {virtualRows.map((virtualRow) => {
            const item = listItems[virtualRow.index]!;

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.offsetTop}px)`,
                  display: "flex",
                }}
              >
                {virtualColumns.map((col) => {
                  const data = listItems[col.index]?.text;

                  return (
                    <div
                      ref={measureColumn}
                      data-row-index={virtualRow.index}
                      data-column-index={col.index}
                      key={col.key}
                      style={{
                        position: "absolute",
                        left: col.offsetLeft,
                        height: virtualRow.height,
                        whiteSpace: "nowrap",
                        padding: 12,
                      }}
                    >
                      {col.index} {data}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
