import React, { useEffect, useState } from "react";
import {
  loadTodosThunk,
  useAppDispatch,
  useStateSelector,
  todoActions,
  useActionCreators,
} from "./store";

const allActions = {
  ...todoActions,
  loadTodos: loadTodosThunk,
};

export const App = () => {
  const items = useStateSelector((state) => state.todo.items);
  const status = useStateSelector((state) => state.todo.status);
  const [title, setTitle] = useState("");

  const dispatch = useAppDispatch();
  const actions = useActionCreators(allActions);

  useEffect(() => {
    dispatch(loadTodosThunk());
    actions.loadTodos();
  }, []);

  const handleDoneChange = (itemId: number) => {
    actions.toggleTodoDone({ id: itemId });
  };

  const handleDeleteTodo = (itemId: number) => {
    actions.deleteTodo({ id: itemId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    actions.addTodo({ title });
    setTitle("");
  };

  const renderList = () => {
    if (status === "init" || status === "loading") {
      return "Loading...";
    }

    if (status === "error") {
      return "Error happened";
    }

    return (
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            style={item.done ? { textDecoration: "line-through" } : undefined}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => handleDoneChange(item.id)}
            />
            {item.title}

            <button
              style={{ outline: "none", marginLeft: 6 }}
              onClick={() => handleDeleteTodo(item.id)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {renderList()}
    </>
  );
};
