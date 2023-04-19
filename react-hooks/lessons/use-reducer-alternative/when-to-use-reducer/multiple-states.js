import { useEffect, useReducer, useState } from "react";

function fetchTodoItems() {
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

export function ExampleWithUseState() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("init");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    fetchTodoItems()
      .then((items) => {
        setStatus("success");
        setItems(items);
      })
      .catch((error) => {
        setStatus("error");
        setError(error);
      });
  }, []);

  console.log(items, status, error);

  return <div>{/* .... */}</div>;
}

export function ExampleWithUseReducer() {
  const [{ items, status, error }, dispatch] = useReducer(
    (state, action) => {
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
    },
    { items: [], status: "init", error: undefined }
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
