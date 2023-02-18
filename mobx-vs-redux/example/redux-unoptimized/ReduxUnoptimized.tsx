import React, { memo, useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import {
  loadTodosThunk,
  useAppDispatch,
  useStateSelector,
  todoActions,
  useActionCreators,
  store,
  TodoItem as TodoItemModel,
} from "./store";

export const ReduxUnoptimized = () => {
  return (
    <Provider store={store}>
      <StoreInner />
    </Provider>
  );
};

export const StoreInner = () => {
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

const TodoListItems = memo(() => {
  const items = useStateSelector((state) => state.todo.items);

  console.log("render todo list");
  const actions = useActionCreators(todoActions);

  const handleDoneChange = useCallback(
    (itemId: number) => {
      actions.toggleTodoDone({ id: itemId });
    },
    [actions]
  );

  const handleDeleteTodo = useCallback(
    (itemId: number) => {
      actions.deleteTodo({ id: itemId });
    },
    [actions]
  );

  return (
    <div>
      {items.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          handleDeleteTodo={handleDeleteTodo}
          handleDoneChange={handleDoneChange}
        />
      ))}
    </div>
  );
});

interface TodoItemProps {
  item: TodoItemModel;
  handleDoneChange: (itemId: number) => void;
  handleDeleteTodo: (itemId: number) => void;
}

const TodoItem = memo(
  ({ item, handleDoneChange, handleDeleteTodo }: TodoItemProps) => {
    console.log("render todo item");

    return (
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
          onClick={() => {
            handleDeleteTodo(item.id);
          }}
        >
          x
        </button>
      </div>
    );
  }
);
