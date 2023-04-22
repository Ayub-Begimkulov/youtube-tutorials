import { useMemo, useReducer } from "react";
import { produce } from "immer";

export function useMethods(options) {
  const initialOptions = useMemo(() => {
    if (typeof options === "function") {
      return options();
    }

    return options;
  }, []);

  const reducer = (state, action) => {
    const currentOptions = typeof options === "function" ? options() : options;

    const newState = produce(state, (draft) =>
      currentOptions.methods[action.type](draft, action.payload)
    );

    return newState;
  };

  const [state, dispatch] = useReducer(reducer, initialOptions.initialState);

  const methods = useMemo(() => {
    const result = {};

    for (const key in initialOptions.methods) {
      result[key] = (payload) => dispatch({ type: key, payload });
    }

    return result;
  }, [initialOptions]);

  return [state, methods];
}

useMethods({
  initialState: {},
  methods: {
    a(state) {
      return { ...state };
    },
    b() {},
  },
});
