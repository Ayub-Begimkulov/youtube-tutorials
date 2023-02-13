import {
  createContext,
  ReactNode,
  useMemo,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { unstable_batchedUpdates } from "react-dom";

class MiniStore<T> {
  private subscriptions: (() => void)[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = () => {
    return this.state;
  };

  update = (partialNewState: Partial<T> | ((state: T) => T)) => {
    this.state =
      typeof partialNewState === "function"
        ? partialNewState(this.state)
        : { ...this.state, ...partialNewState };

    unstable_batchedUpdates(() => {
      this.subscriptions.forEach((cb) => {
        cb();
      });
    });
  };

  subscribe = (cb: () => void) => {
    this.subscriptions.push(cb);

    return () => {
      const index = this.subscriptions.indexOf(cb);

      if (index === -1) {
        return;
      }

      this.subscriptions.splice(index, 1);
    };
  };
}

export function createOptimizedContext<T>() {
  const Context = createContext<MiniStore<T> | null>(null);

  const Provider = ({
    initialState,
    children,
  }: {
    initialState: T;
    children: ReactNode;
  }) => {
    const store = useMemo(() => new MiniStore(initialState), []);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const store = useContext(Context);
    if (!store) {
      throw new Error("Can not use `useStore` outside of the `Provider`");
    }
    return store;
  };

  const useStateSelector = <Result extends any>(
    selector: (state: T) => Result
  ): Result => {
    const store = useStore();
    const [state, setState] = useState(() => selector(store.getState()));
    const selectorRef = useRef(selector);
    const stateRef = useRef(state);

    useLayoutEffect(() => {
      selectorRef.current = selector;
      stateRef.current = state;
    });

    useEffect(() => {
      return store.subscribe(() => {
        const state = selectorRef.current(store.getState());

        if (stateRef.current === state) {
          return;
        }

        setState(state);
      });
    }, [store]);

    return state;
  };

  const useUpdate = () => {
    const store = useStore();

    return store.update;
  };

  return { Provider, useStateSelector, useUpdate };
}
