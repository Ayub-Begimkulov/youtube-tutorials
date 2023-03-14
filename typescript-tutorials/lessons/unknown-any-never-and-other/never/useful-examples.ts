export {};

function exhaustiveCheck(value: never) {
  return value;
}

interface State {
  count: number;
}
type Action =
  | { type: "increment"; payload: number }
  | { type: "decrement"; payload: number };

function reducer(state: State, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case "increment":
      return {
        ...state,
        count: state.count + payload,
      };
    case "decrement":
      return {
        ...state,
        count: state.count - payload,
      };
    default:
      return exhaustiveCheck(type);
  }
}

reducer({ count: 1 }, { type: "increment", payload: 2 });

type FilterTest<T extends string> = T extends "test" ? never : T;

type Test = FilterTest<"asdf" | "asdf2" | "qwer" | "test">;
//   ^?

declare let a: Test;
