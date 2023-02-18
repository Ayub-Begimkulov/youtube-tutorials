type Action = {
  type: string;
  payload: any;
};

function createStore<T extends object>(
  reducer: (state: T, action: Action) => T,
  initialState: T
) {
  let state = initialState;
  const subscribers = new Set<() => void>();

  const getState = () => {
    return state;
  };

  const dispatch = (action: Action) => {
    state = reducer(state, action);

    subscribers.forEach((cb) => {
      cb();
    });

    return action;
  };

  const subscribe = (cb: () => void) => {
    subscribers.add(cb);

    return () => {
      subscribers.delete(cb);
    };
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
}

const initialState = {
  test: 5,
  a: "asf",
};

const store = createStore((state, action) => {
  switch (action.type) {
    case "updateTest":
      return { ...state, test: action.payload };
    case "updateA":
      return { ...state, a: action.payload };
    default:
      return state;
  }
}, initialState);

store.subscribe(() => {
  const state = store.getState();

  console.log(state.test /* , state.a */);
});

store.dispatch({
  type: "updateTest",
  payload: 6,
});
store.dispatch({
  type: "updateTest",
  payload: 7,
});
store.dispatch({
  type: "updateTest",
  payload: 7,
});

store.dispatch({
  type: "updateA",
  payload: "asdf",
});
store.dispatch({
  type: "updateA",
  payload: "asdf2",
});
store.dispatch({
  type: "updateA",
  payload: "asdf3",
});

export {};
