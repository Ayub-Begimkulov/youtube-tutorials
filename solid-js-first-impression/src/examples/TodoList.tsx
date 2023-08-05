import { For, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { generateId } from "../utils/generate-id";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = createStore<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = createSignal("");

  const addTodo = () => {
    const title = newTodoText();

    setNewTodoText("");

    setTodos(todos.length, {
      id: generateId(),
      title,
      completed: false,
    });

    // setTodos([
    //   ...todos,
    //   {
    //     id: generateId(),
    //     title,
    //     completed: false,
    //   },
    // ]);

    // setTodos((todos) => [
    //   ...todos,
    //   {
    //     id: generateId(),
    //     title,
    //     completed: false,
    //   },
    // ]);

    // setTodos(
    //   produce((todos) => {
    //     todos.push({
    //       id: generateId(),
    //       title,
    //       completed: false,
    //     });
    //   })
    // );

    // not working
    // setTodos((todos) => {
    //   todos.push({
    //     id: generateId(),
    //     title,
    //     completed: false,
    //   });

    //   return todos;
    // });
  };

  const deleteTodo = (id: number) => {
    setTodos(
      produce((todos) => {
        const index = todos.findIndex((todo) => todo.id === id);

        todos.splice(index, 1);
      })
    );
  };

  const updateTodoCompleted = (id: number, newCompleted: boolean) => {
    setTodos(
      produce((todos) => {
        const item = todos.find((todo) => todo.id === id);

        if (item) {
          item.completed = newCompleted;
        }
      })
    );
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={newTodoText()}
          onChange={(e) => setNewTodoText(e.target.value)}
          type="text"
        />
        <button>Add</button>
      </form>

      <For each={todos}>
        {(todo /* index */) => {
          return (
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodoCompleted={updateTodoCompleted}
            />
          );
        }}
      </For>
    </div>
  );
};

interface TodoItemProps {
  todo: TodoItem;
  deleteTodo: (id: number) => void;
  updateTodoCompleted: (id: number, newCompleted: boolean) => void;
}

const TodoItem = (props: TodoItemProps) => {
  console.log("mount");
  return (
    <div>
      <input
        type="checkbox"
        checked={props.todo.completed}
        onChange={(e) =>
          props.updateTodoCompleted(props.todo.id, e.target.checked)
        }
      />
      {props.todo.title}

      <button onClick={() => props.deleteTodo(props.todo.id)}>X</button>
    </div>
  );
};
