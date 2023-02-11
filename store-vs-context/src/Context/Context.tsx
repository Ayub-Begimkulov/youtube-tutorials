import { useEffect, useState } from "react";
import { loadTodosFn } from "../services";
import { getId } from "../utils";
import { createOptimizedContext } from "./create-optimized-context";

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

interface TodoState {
  itemsMap: Record<string, TodoItem>;
  itemIds: number[];
  status: "init" | "loading" | "error" | "success";
}

const initialState: TodoState = { itemsMap: {}, itemIds: [], status: "init" };

const {
  Provider: AppProvider,
  useStateSelector,
  useUpdate,
} = createOptimizedContext<TodoState>();

export const Context = () => {
  return (
    <AppProvider initialState={initialState}>
      <ContextInner />
    </AppProvider>
  );
};
const ContextInner = () => {
  const status = useStateSelector((state) => state.status);

  const update = useUpdate();

  useEffect(() => {
    update({ status: "loading" });

    loadTodosFn()
      .then((todos) => {
        const itemsMap: Record<number, TodoItem> = {};
        const itemIds: number[] = [];

        todos.forEach((item) => {
          itemIds.push(item.id);
          itemsMap[item.id] = item;
        });

        update({
          status: "success",
          itemIds,
          itemsMap,
        });
      })
      .catch((error) => {
        console.error(error);

        update({
          status: "error",
        });
      });
  }, [update]);

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
  const update = useUpdate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    const newItem = {
      id: getId(),
      title,
    };
    update((state) => ({
      ...state,
      itemsMap: { ...state.itemsMap, [newItem.id]: newItem },
      itemIds: [...state.itemIds, newItem.id],
    }));

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
  const itemsIds = useStateSelector((state) => state.itemIds);
  const update = useUpdate();

  console.log("render todo list");

  const handleDoneChange = (itemId: number) => {
    update((state) => ({
      ...state,
      itemsMap: {
        ...state.itemsMap,
        [itemId]: {
          ...state.itemsMap[itemId],
          done: !state.itemsMap[itemId]?.done,
        },
      },
    }));
  };

  const handleDeleteTodo = (itemId: number) => {
    update((state) => ({
      ...state,
      itemsMap: {
        ...state.itemsMap,
        [itemId]: undefined,
      },
      itemIds: itemsIds.filter((id) => id !== itemId),
    }));
  };

  return (
    <div>
      {itemsIds.map((id) => (
        <TodoItem
          key={id}
          id={id}
          handleDeleteTodo={handleDeleteTodo}
          handleDoneChange={handleDoneChange}
        />
      ))}
    </div>
  );
};

interface TodoItemProps {
  id: number;
  handleDoneChange: (itemId: number) => void;
  handleDeleteTodo: (itemId: number) => void;
}

const TodoItem = ({
  id,
  handleDoneChange,
  handleDeleteTodo,
}: TodoItemProps) => {
  const item = useStateSelector((state) => state.itemsMap[id]);

  // unnecessary renders
  console.log("render todo item");

  if (!item) {
    return null;
  }

  return (
    <div
      key={id}
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
          console.log("before delete");
          handleDeleteTodo(item.id);

          // Could have an error without batching.
          // setTimeout(() => {
          //   console.log("before delete");
          //   handleDeleteTodo(item.id);
          // }, 500);
        }}
      >
        x
      </button>
    </div>
  );
};
