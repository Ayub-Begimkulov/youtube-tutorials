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
  columnsCount: number;
  columnWidth: (index: number) => number;
  getColumnKey: (index: number) => Key;
  overscanY?: number;
  overscanX?: number;
  scrollingDelay?: number;
  getScrollElement: () => HTMLElement | null;
}

interface DynamicSizeGridRow {
  key: Key;
  index: number;
  offsetTop: number;
  height: number;
}

interface DynamicSizeGridColumn {
  key: Key;
  index: number;
  offsetLeft: number;
  width: number;
}

const DEFAULT_OVERSCAN_Y = 3;
const DEFAULT_OVERSCAN_X = 1;
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
    columnsCount,
    columnWidth,
    getColumnKey,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    overscanX = DEFAULT_OVERSCAN_X,
    overscanY = DEFAULT_OVERSCAN_Y,
    getScrollElement,
  } = props;

  const [rowSizeCache, setRowSizeCache] = useState<Record<Key, number>>({});
  const [gridHeight, setGridHeight] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);
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
            height: entry.borderBoxSize[0].blockSize,
            width: entry.borderBoxSize[0].inlineSize,
          }
        : entry.target.getBoundingClientRect();

      setGridHeight(size.height);
      setGridWidth(size.width);
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
      const rangeEnd = scrollTop + gridHeight;

      let totalHeight = 0;
      let rowStartIndex = 0;
      let rowEndIndex = 0;
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
        rowStartIndex,
        rowEndIndex,
        allRows,
        totalHeight,
      };
    }, [
      scrollTop,
      overscanY,
      gridHeight,
      rowHeight,
      getRowKey,
      estimateRowHeight,
      rowSizeCache,
      rowsCount,
    ]);

  const {
    virtualColumns,
    columnStartIndex,
    columnEndIndex,
    allColumns,
    totalWidth,
  } = useMemo(() => {
    const rangeStart = scrollLeft;
    const rangeEnd = scrollLeft + gridWidth;

    let totalWidth = 0;
    let columnStartIndex = 0;
    let columnEndIndex = 0;
    const allColumns: DynamicSizeGridColumn[] = Array(columnsCount);

    for (let index = 0; index < columnsCount; index++) {
      const key = getColumnKey(index);
      const column = {
        key,
        index: index,
        width: columnWidth(index),
        offsetLeft: totalWidth,
      };

      totalWidth += column.width;
      allColumns[index] = column;

      if (column.offsetLeft + column.width < rangeStart) {
        columnStartIndex++;
      }

      if (column.offsetLeft + column.width <= rangeEnd) {
        columnEndIndex++;
      }
    }

    columnStartIndex = Math.max(0, columnStartIndex - overscanY);
    columnEndIndex = Math.min(rowsCount - 1, columnEndIndex + overscanY);

    const virtualColumns = allColumns.slice(
      columnStartIndex,
      columnEndIndex + 1
    );

    return {
      virtualColumns,
      columnStartIndex,
      columnEndIndex,
      allColumns,
      totalWidth,
    };
  }, [
    scrollLeft,
    overscanX,
    gridWidth,
    columnWidth,
    getColumnKey,
    columnsCount,
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
    virtualColumns,
    columnStartIndex,
    columnEndIndex,
    allColumns,
    totalWidth,
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

  const { virtualRows, totalHeight, measureRow, totalWidth, virtualColumns } =
    useDynamicSizeGrid({
      estimateRowHeight: useCallback(() => 16, []),
      rowsCount: gridSize,
      columnsCount: gridSize,
      columnWidth: useCallback(() => 200, []),
      getColumnKey: useCallback((index) => index, []),
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
        <div style={{ height: totalHeight, width: totalWidth }}>
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
                {/* {virtualRow.index} */}
                {virtualColumns.map((virtualColumn, index) => {
                  const item =
                    gridItems[virtualRow.index]?.columns[virtualColumn.index];
                  return (
                    <div
                      style={{
                        marginLeft: index === 0 ? virtualColumn.offsetLeft : 0,
                        // position: "absolute",
                        // left: virtualColumn.offsetLeft,
                        width: virtualColumn.width,
                      }}
                      key={virtualColumn.key}
                    >
                      {item?.text}
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
