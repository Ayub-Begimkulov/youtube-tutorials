import { flowResult } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import {
  store,
  StoreProvider,
  useStore,
  TodoItem as TodoItemModel,
} from "./store";

export const Mobx = () => {
  return (
    <StoreProvider store={store}>
      <StoreInner />
    </StoreProvider>
  );
};

export const StoreInner = observer(() => {
  const store = useStore();

  const status = store.todos.status;

  useEffect(() => {
    const result = flowResult(store.todos.fetchTodos());

    return () => {
      result.cancel();
    };
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
});

const AddTodoForm = observer(() => {
  const [title, setTitle] = useState("");
  const { todos } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    todos.addTodo({ title });
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
});

const TodoListItems = observer(() => {
  console.log("render todo list");
  const todos = useStore((state) => state.todos);

  const handleDoneChange = useCallback(
    (itemId: number) => {
      todos.toggleTodoDone({ id: itemId });
    },
    [todos]
  );

  const handleDeleteTodo = useCallback(
    (itemId: number) => {
      todos.deleteTodo({ id: itemId });
    },
    [todos]
  );

  return (
    <div>
      {todos.items.map((item) => (
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

const TodoItem = observer(
  ({ item, handleDoneChange, handleDeleteTodo }: TodoItemProps) => {
    console.log("render todo item");

    return (
      <div style={item.done ? { textDecoration: "line-through" } : undefined}>
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
