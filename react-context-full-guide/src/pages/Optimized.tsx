import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Wrapper } from "../components/Wrapper";

const useRenderCount = () => {
  const count = useRef(0);

  count.current++;

  return count.current;
};

class MiniStore<T> {
  private subscriptions: Set<() => void> = new Set<() => void>();
  private state: T;
  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = () => {
    return this.state;
  };

  update = (partialNewState: Partial<T>) => {
    this.state = { ...this.state, ...partialNewState };

    this.subscriptions.forEach((cb) => {
      cb();
    });
  };

  subscribe = (cb: () => void) => {
    this.subscriptions.add(cb);

    return () => {
      this.subscriptions.delete(cb);
    };
  };
}

function createOptimizedContext<T>() {
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

interface AppContextData {
  value: string;
}

const {
  Provider: AppProvider,
  useStateSelector,
  useUpdate,
} = createOptimizedContext<AppContextData>();

const Form = () => {
  const renderCount = useRenderCount();
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <div>Render count: {renderCount}</div>
      <FormInput />
    </Wrapper>
  );
};

const FormInput = () => {
  const updateValue = useUpdate();
  const renderCount = useRenderCount();

  return (
    <Wrapper title="FormInput">
      <div>Render count: {renderCount}</div>
      <input
        type="text"
        onChange={(e) => updateValue({ value: e.target.value })}
      />
    </Wrapper>
  );
};

const TextDisplay = () => {
  const renderCount = useRenderCount();
  return (
    <Wrapper
      title="TextDisplay"
      style={{
        height: 300,
        width: 300,
      }}
    >
      <div>Render count: {renderCount}</div>
      <Text />
    </Wrapper>
  );
};

const Text = () => {
  const value = useStateSelector((state) => state.value);
  const renderCount = useRenderCount();

  return (
    <Wrapper title="Text">
      Render Count: {renderCount}
      <div>{value}</div>
    </Wrapper>
  );
};

export const Optimized = () => {
  return (
    <AppProvider initialState={{ value: "" }}>
      <Form />
      <TextDisplay />
    </AppProvider>
  );
};
