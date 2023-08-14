import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  isNumber,
  scheduleDOMUpdate,
  useLatest,
  useResizeObserver,
} from "../utils";

interface TableRow {
  key: string | number;
  index: number;
  height: number;
  offsetTop: number;
}

interface TableColumn {
  index: number;
  width: number;
  offsetLeft: number;
}

interface UseDynamicGridProps {
  columnsCount: number;
  rowsCount: number;
  overscanX?: number;
  overscanY?: number;
  scrollingDelay?: number;
  getItemKey: (index: number) => string | number;
  getScrollElement: () => Element | null;
  columnWidth: (index: number) => number;
  rowHeight?: (index: number) => number;
  estimateRowHeight?: (index: number) => number;
}

function validateProps(props: UseDynamicGridProps) {
  const { rowHeight, estimateRowHeight } = props;

  if (!rowHeight && !estimateRowHeight) {
    throw new Error(
      "you must pass either `columnWidth` or `estimateRowHeight`"
    );
  }
}

const DEFAULT_SCROLLING_DELAY = 150;
const DEFAULT_OVERSCAN_X = 3;
const DEFAULT_OVERSCAN_Y = 1;

function useGrid(props: UseDynamicGridProps) {
  validateProps(props);

  const {
    columnsCount,
    rowsCount,
    overscanX = DEFAULT_OVERSCAN_X,
    overscanY = DEFAULT_OVERSCAN_Y,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    getItemKey,
    getScrollElement,
    columnWidth,
    rowHeight,
    estimateRowHeight,
  } = props;

  const [{ width: gridWidth, height: gridHeight }, setGridSize] = useState({
    width: 0,
    height: 0,
  });
  const [measureCache, setMeasureCache] = useState<Record<string, number>>({});
  const [scrollOffset, setScrollOffset] = useState({ top: 0, left: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  useLayoutEffect(() => {
    const scrollContainer = getScrollElement();

    if (!scrollContainer) {
      return;
    }

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      const borderBoxSize = entry.borderBoxSize[0];
      const newSize = borderBoxSize
        ? { width: borderBoxSize.inlineSize, height: borderBoxSize.inlineSize }
        : entry.target.getBoundingClientRect();

      const scrollBarSizeY =
        entry.target instanceof HTMLElement
          ? entry.target.offsetHeight - entry.target.clientHeight
          : 0;
      const scrollBarSizeX =
        entry.target instanceof HTMLElement
          ? entry.target.offsetWidth - entry.target.clientWidth
          : 0;

      setGridSize({
        width: newSize.width - scrollBarSizeX,
        height: newSize.height - scrollBarSizeY,
      });
    });

    ro.observe(scrollContainer);

    return () => {
      ro.disconnect();
    };
  }, [getScrollElement]);

  useLayoutEffect(() => {
    const scrollContainer = getScrollElement();

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      setScrollOffset((prevScrollOffset) => {
        const scrollOffset = {
          top: scrollContainer.scrollTop,
          left: scrollContainer.scrollLeft,
        };

        if (
          prevScrollOffset.top === scrollOffset.top &&
          prevScrollOffset.left === scrollOffset.left
        ) {
          return prevScrollOffset;
        }

        return scrollOffset;
      });
    };

    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [getScrollElement]);

  useLayoutEffect(() => {
    const scrollContainer = getScrollElement();

    if (!scrollContainer) {
      return;
    }
    let timeoutId: number | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (isNumber(timeoutId)) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsScrolling(false);
        timeoutId = null;
      }, scrollingDelay);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (isNumber(timeoutId)) {
        clearTimeout(timeoutId);
      }
    };
  }, [getScrollElement, scrollingDelay]);

  const rowData = useMemo(() => {
    const getRowHeight = (index: number, key: string | number) => {
      if (rowHeight) {
        return rowHeight(index);
      }

      if (measureCache[key]) {
        return measureCache[key]!;
      }

      return estimateRowHeight!(index);
    };

    const rangeRenderStart = scrollOffset.top;
    // TODO scrollbar measure
    const rangeRenderEnd = scrollOffset.top + gridHeight - 15;

    let totalHeight = 0;
    let rowStartIndex = -1;
    let rowEndIndex = -1;
    const allRows: TableRow[] = Array(rowsCount);

    for (let i = 0; i < rowsCount; i++) {
      const key = getItemKey(i);
      const rowHeight = getRowHeight(i, key);

      const row = {
        key,
        index: i,
        height: rowHeight,
        offsetTop: totalHeight,
      };

      allRows[i] = row;
      totalHeight += rowHeight;

      if (
        row.offsetTop + row.height > rangeRenderStart &&
        rowStartIndex === -1
      ) {
        rowStartIndex = Math.max(0, row.index - overscanX);
      }

      if (row.offsetTop + row.height >= rangeRenderEnd && rowEndIndex === -1) {
        rowEndIndex = Math.min(rowsCount - 1, i + overscanX);
      }
    }

    const rows = allRows.slice(rowStartIndex, rowEndIndex + 1);

    return { totalHeight, rows, allRows, rowStartIndex, rowEndIndex };
  }, [
    scrollOffset,
    gridHeight,
    rowsCount,
    rowHeight,
    estimateRowHeight,
    getItemKey,
    measureCache,
    overscanX,
  ]);

  // TODO measure columns also?
  const columnData = useMemo(() => {
    const rangeRenderStart = scrollOffset.left;
    // TODO scrollbar measure
    const rangeRenderEnd = scrollOffset.left + gridWidth - 15;

    let totalWidth = 0;
    let columnStartIndex = -1;
    let columnEndIndex = -1;

    const allColumns: TableColumn[] = [];

    for (let i = 0; i < columnsCount; i++) {
      const width = columnWidth(i);

      const column = {
        index: i,
        offsetLeft: totalWidth,
        width,
      };

      allColumns.push(column);
      totalWidth += width;

      if (totalWidth > rangeRenderStart && columnStartIndex === -1) {
        columnStartIndex = Math.max(0, i - overscanY);
      }
      if (totalWidth >= rangeRenderEnd && columnEndIndex === -1) {
        columnEndIndex = Math.min(i + overscanY, columnsCount - 1);
      }
    }

    const columns = allColumns.slice(columnStartIndex, columnEndIndex + 1);
    console.log(columns, columnStartIndex, columnEndIndex);

    return {
      totalWidth,
      columnStartIndex,
      columnEndIndex,
      allColumns,
      columns,
    };
  }, [scrollOffset, gridWidth, columnsCount, columnWidth, overscanY]);

  const latestAllRows = useLatest(rowData.allRows);
  const latestCache = useLatest(measureCache);
  const latestScrollOffset = useLatest(scrollOffset);
  const latestGetScrollElement = useLatest(getScrollElement);

  const resizeObserver = useResizeObserver((entires) => {
    entires.forEach((entry) => {
      measureElementLogic(entry.target, entry);
    });
  });

  const measureElementLogic = useCallback(
    (element: Element, entry?: ResizeObserverEntry) => {
      if (!element.isConnected) {
        resizeObserver.unobserve(element);
        return;
      }

      const index = element.getAttribute("data-index") || "";
      const parsedIndex = parseInt(index, 10);

      if (Number.isNaN(parsedIndex)) {
        console.error(
          "dynamic size elements must have correct `data-index` attribute"
        );
        return;
      }

      const key = getItemKey(parsedIndex);
      const isResize = Boolean(entry);

      // get value from cache if it's not a resize
      if (typeof latestCache.current[key] === "number" && !isResize) {
        resizeObserver.observe(element);
        return;
      }

      const row = latestAllRows.current[parsedIndex]!;
      const estimateHeight = row.height;
      const height =
        entry?.borderBoxSize[0]?.blockSize ??
        element.getBoundingClientRect().height;
      if (latestCache.current[key] === height) {
        return;
      }

      const delta = height - estimateHeight;

      // correction of the scroll when resizing
      // shit for performance???
      if (delta !== 0 && row.offsetTop < latestScrollOffset.current.top) {
        const element = latestGetScrollElement.current();
        if (element) {
          scheduleDOMUpdate(() => {
            element.scrollBy(0, delta);
          });
        }
      }

      resizeObserver.observe(element);

      setMeasureCache((cache) => ({ ...cache, [key]: height }));
    },
    [getItemKey, resizeObserver]
  );

  const measureElement = useCallback(
    (element: Element | null) => {
      if (!element) {
        return;
      }

      measureElementLogic(element);
    },
    [measureElementLogic]
  );

  return { ...rowData, ...columnData, isScrolling, measureElement };
}

const items = Array.from({ length: 1_000 }, (_, index) => ({
  id: Math.random().toString(36).slice(2),
  index: index + 1,
  text: faker.lorem.text(),
  text2: faker.lorem.text(),
  text3: faker.lorem.text(),
  text4: faker.lorem.text(),
  text5: faker.lorem.text(),
  text6: faker.lorem.text(),
}));
const columnKeys = Object.keys(items[0]!).filter((col) => col !== "id");

const containerHeight = 800;
const containerWidth = 900;

export const Advanced = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    rows,
    columns,
    totalHeight,
    totalWidth,
    measureElement,
    // isScrolling,
  } = useGrid({
    columnsCount: columnKeys.length,
    rowsCount: items.length,
    getScrollElement: useCallback(() => scrollContainerRef.current, []),
    estimateRowHeight: useCallback(() => 40, []),
    columnWidth: useCallback((index) => (index === 0 ? 30 : 250), []),
    getItemKey: useCallback((index) => items[index]!.id, []),
  });

  return (
    <div style={{ height: "100%", padding: 12 }}>
      <h1>Table</h1>

      <div
        ref={scrollContainerRef}
        style={{
          height: containerHeight,
          width: containerWidth,
          position: "relative",
          overflow: "auto",
        }}
      >
        <div style={{ height: totalHeight, width: totalWidth }}>
          {rows.map((row) => {
            const item = items[row.index]!;

            return (
              <div
                key={item.id}
                style={{
                  height: row.height,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateY(${row.offsetTop}px)`,
                }}
              >
                {
                  /* isScrolling ? (
                  <div key={"a"}>Loading...</div>
                ) :  */ <div
                    // key={"b"}
                    ref={measureElement}
                    data-index={row.index}
                    style={{ display: "flex" /* , padding: 12 */ }}
                  >
                    {columns.map((col, index) => (
                      <div
                        key={col.index}
                        style={{
                          width: col.width,
                          marginLeft: index === 0 ? col.offsetLeft : 0,
                          padding: "12px 6px",
                        }}
                      >
                        {item[columnKeys[col.index] as keyof typeof item]}
                      </div>
                    ))}
                  </div>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
