import { useEffect, useReducer } from "react";

interface TodoItem {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type RequestStatus = "init" | "success" | "loading" | "error";

function fetchTodoItems(): Promise<TodoItem[]> {
  return fetch("https://jsonplaceholder.typicode.com/todos/").then(
    (response) => {
      if (!response.ok) {
        return Promise.reject({
          message: response.text(),
          code: response.status,
        });
      }

      return response.json();
    }
  );
}

interface TodoState {
  items: TodoItem[];
  status: RequestStatus;
  error?: { message: string; code: number };
}

const reducer = (
  state: TodoState,
  action: { type: string; payload?: any }
): TodoState => {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, status: "loading" };
    case "REQUEST_SUCCESS":
      return { ...state, status: "success", items: action.payload };
    case "REQUEST_ERROR":
      return { ...state, status: "error", error: action.payload };
    default:
      return state;
  }
};

const initialState: TodoState = {
  items: [],
  status: "init",
  error: undefined,
};

export function ExampleWithUseReducer() {
  const [{ items, status, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: "REQUEST_START" });
    fetchTodoItems()
      .then((items) => {
        dispatch({ type: "REQUEST_SUCCESS", payload: items });
      })
      .catch((error) => {
        dispatch({ type: "REQUEST_ERROR", payload: error });
      });
  }, []);

  console.log(items, status, error);

  return <div>{/* .... */}</div>;
}
