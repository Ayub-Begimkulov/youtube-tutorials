import React, { useEffect, useState } from "react";
import {
  loadTodosThunk,
  useAppDispatch,
  useStateSelector,
  todoActions,
  useActionCreators,
} from "./store";

export const App = () => {
  // ERROR! will update way more times
  // const { status } = useStateSelector((state) => state.todo);
  const status = useStateSelector((state) => state.todo.status);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTodosThunk());
  }, []);

  const renderList = () => {
    if (status === "init" || status === "loading") {
      return "Loading...";
    }

    if (status === "error") {
      return "Error happened";
    }

    return <TodoListItems />;
  };

  return (
    <>
      <AddTodoForm />
      {renderList()}
    </>
  );
};

const AddTodoForm = () => {
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    dispatch(todoActions.addTodo({ title }));
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

const TodoListItems = () => {
  const items = useStateSelector((state) => state.todo.items);
  // const dispatch = useAppDispatch();

  const actions = useActionCreators(todoActions);

  const handleDoneChange = (itemId: number) => {
    // dispatch(todoActions.toggleTodoDone({ id: itemId }));
    actions.toggleTodoDone({ id: itemId });
  };

  const handleDeleteTodo = (itemId: number) => {
    // dispatch(todoActions.deleteTodo({ id: itemId }));
    actions.deleteTodo({ id: itemId });
  };

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
