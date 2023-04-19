import { useCallback, useReducer, useState } from "react";

export function useUndoState(initialValue, maxHistory = 10) {
  const [previous, setPrevious] = useState([]);
  const [value, setValue] = useState(initialValue);
  const [next, setNext] = useState([]);

  const update = useCallback(
    (newValue) => {
      setPrevious((items) =>
        items.length < maxHistory
          ? [...items, value]
          : [...items.slice(1), value]
      );
      setValue(newValue);
      setNext([]);
    },
    [value, maxHistory]
  );

  const undo = useCallback(() => {
    if (previous.length === 0) {
      return;
    }
    const prevValue = previous[previous.length - 1];
    setValue(prevValue);
    setPrevious(previous.slice(0, -1));
    setNext((next) =>
      next.length < maxHistory
        ? [value, ...next]
        : [value, ...next.slice(0, -1)]
    );
  }, [value, previous, maxHistory]);

  const redo = useCallback(() => {
    if (next.length === 0) {
      return;
    }
    const nextValue = next[0];
    setValue(nextValue);
    setNext(next.slice(1));
    setPrevious((prev) =>
      prev.length < maxHistory ? [...prev, value] : [...prev.slice(1), value]
    );
  }, [value, next]);

  return [value, update, undo, redo];
}

export function useUndoStateReducer(initialValue, maxHistory = 10) {
  const [{ value }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "UPDATE": {
          const newPrevious =
            state.previous.length < maxHistory
              ? [...state.previous, state.value]
              : [...state.previous.slice(1), state.value];

          return {
            ...state,
            next: [],
            value: action.payload,
            previous: newPrevious,
          };
        }
        case "UNDO": {
          if (state.previous.length === 0) {
            return state;
          }

          const newNext =
            state.next.length < maxHistory
              ? [state.value, ...state.next]
              : [state.value, ...state.next.slice(1)];

          return {
            ...state,
            next: newNext,
            value: state.previous[state.previous.length - 1],
            previous: state.previous.slice(0, -1),
          };
        }

        case "REDO": {
          if (state.next.length === 0) {
            return state;
          }

          const newPrevious =
            state.previous.length < maxHistory
              ? [...state.previous, state.value]
              : [...state.previous.slice(1), state.value];

          return {
            ...state,
            next: state.next.slice(1),
            value: state.next[0],
            previous: newPrevious,
          };
        }
        default:
          return state;
      }
    },
    {
      value: initialValue,
      previous: [],
      next: [],
    }
  );

  const update = useCallback((newValue) => {
    dispatch({ type: "UPDATE", payload: newValue });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  return [value, update, undo, redo];
}
