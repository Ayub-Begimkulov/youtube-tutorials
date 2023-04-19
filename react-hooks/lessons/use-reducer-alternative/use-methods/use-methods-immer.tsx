import { produce } from "immer";
import { useMemo, useReducer } from "react";

type AnyAction = {
  type: string;
  payload?: any;
};
type AnyMethod = (state: any, payload?: any) => any;

type Tail<Arr extends readonly unknown[]> = Arr extends readonly [
  unknown,
  ...infer Rest
]
  ? Rest
  : [];

interface UseMethodsOptions<State, Methods> {
  initialState: State;
  methods: Methods;
}

type AnyMethodsMap<State> = Record<
  string,
  (state: State, payload?: any) => State | void
>;

type UseMethodsInit<State, Methods extends AnyMethodsMap<State>> =
  | (() => UseMethodsOptions<State, Methods>)
  | UseMethodsOptions<State, Methods>;

type BoundMethod<Method extends AnyMethod> = (
  ...args: Tail<Parameters<Method>>
) => void;

type BoundMethods<Methods extends AnyMethodsMap<any>> = {
  [Key in keyof Methods]: BoundMethod<Methods[Key]>;
};

function useMethods<State, Methods extends AnyMethodsMap<State>>(
  options: UseMethodsInit<State, Methods>
): [State, BoundMethods<Methods>] {
  // create options only 1 time
  const actualOptions = useMemo(
    () => (typeof options === "object" ? options : options()),
    []
  );

  const reducer = (state: State, action: AnyAction) => {
    const actionReducer = actualOptions.methods[action.type];
    const newState = produce(state, (draft: State) =>
      actionReducer(draft, action.payload)
    );

    return newState;
  };

  const [state, dispatch] = useReducer(reducer, actualOptions.initialState);

  const methods = useMemo(() => {
    const result: Record<string, Function> = {};
    for (const key in actualOptions.methods) {
      result[key] = (payload?: unknown) => dispatch({ type: key, payload });
    }
    return result;
  }, [actualOptions]);

  return [state, methods as BoundMethods<Methods>];
}

const [state, methods] = useMethods(() => ({
  initialState: {
    count: 5,
  },
  methods: {
    increment(state, amount: number) {
      return { ...state, count: state.count - amount };
    },
    decrement(state, amount: number) {
      return { ...state, count: state.count - amount };
    },
    test(state) {
      state.count++;
    },
  },
}));
