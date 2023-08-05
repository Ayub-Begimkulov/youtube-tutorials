import { For, createSignal } from "solid-js";
import { generateId } from "../utils/generate-id";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export const TodoListSignals = () => {
  const [todos, setTodos] = createSignal<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = createSignal("");

  const addTodo = () => {
    const title = newTodoText();

    setNewTodoText("");

    setTodos([
      ...todos(),
      {
        id: generateId(),
        title,
        completed: false,
      },
    ]);
  };

  const deleteTodo = (id: number) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const updateTodoCompleted = (id: number, newCompleted: boolean) => {
    const newTodos = todos().map((todo) => {
      if (todo.id === id) {
        return todo;
      }

      return {
        ...todo,
        completed: newCompleted,
      };
    });
    setTodos(newTodos);
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

      <For each={todos()}>
        {(todo) => (
          <TodoItem
            todo={todo}
            deleteTodo={deleteTodo}
            updateTodoCompleted={updateTodoCompleted}
          />
        )}
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
