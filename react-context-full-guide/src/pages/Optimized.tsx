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

class MiniStore<T extends object> {
  private subscriptions: (() => void)[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  update(partialNewState: Partial<T>) {
    this.state = { ...this.state, ...partialNewState };

    this.subscriptions.forEach((cb) => {
      cb();
    });
  }

  subscribe(cb: () => void) {
    this.subscriptions.push(cb);

    return () => {
      const index = this.subscriptions.indexOf(cb);

      if (index === -1) {
        return;
      }

      this.subscriptions.splice(index, 1);
    };
  }
}

function createOptimizedContext<T extends object>() {
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
      throw new Error("Can not use `useContextData` outside of the `Provider`");
    }
    return store;
  };

  const useStateSelector = <Result extends any>(
    selector: (state: T) => Result
  ) => {
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

  return { Provider, useStateSelector, useStore };
}

interface AppContextData {
  value: string;
}
const {
  Provider: AppProvider,
  useStateSelector,
  useStore,
} = createOptimizedContext<AppContextData>();

const Form = () => {
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <FormInput />
    </Wrapper>
  );
};

const FormInput = () => {
  const store = useStore();
  const renderCount = useRenderCount();

  return (
    <Wrapper title="FormInput">
      <div>Render count: {renderCount}</div>
      <input
        type="text"
        onChange={(e) => store.update({ value: e.target.value })}
      />
    </Wrapper>
  );
};

const TextDisplay = () => {
  return (
    <Wrapper
      title="TextDisplay"
      style={{
        height: 300,
        width: 300,
      }}
    >
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
