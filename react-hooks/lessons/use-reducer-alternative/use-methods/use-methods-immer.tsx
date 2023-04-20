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

export function useUndoStateReducer<T>(initialValue: T, maxHistory = 10) {
  const [{ value }, methods] = useMethods({
    initialState: {
      value: initialValue,
      previous: [] as T[],
      next: [] as T[],
    },
    methods: {
      update(state, newValue: T) {
        if (state.previous.length === maxHistory) {
          state.previous.shift();
        }

        state.previous.push(state.value);
        state.next = [];
        state.value = newValue;
      },
      undo(state) {
        if (state.previous.length === 0) {
          return;
        }

        const previousValue = state.previous.pop()!;

        if (state.next.length === maxHistory) {
          state.next.pop();
        }
        state.next.unshift(state.value);

        state.value = previousValue;
      },
      redo(state) {
        if (state.next.length === 0) {
          return;
        }

        if (state.previous.length === maxHistory) {
          state.previous.shift();
        }
        state.previous.push(state.value);

        state.value = state.next[0];
        state.next = state.next.slice(1);
      },
    },
  });

  return [value, methods.update, methods.undo, methods.redo];
}
