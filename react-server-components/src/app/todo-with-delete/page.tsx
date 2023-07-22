import { fetchTodos } from "@/services";
import { sleep } from "@/utils/sleep";
import { TodoCheckbox } from "./TodoCheckbox";
import { TodoDeleteButton } from "./TodoDeleteButton";

export default async function TodosApp() {
  const todos = await fetchTodos();
  await sleep(2_000);

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <TodoCheckbox todoId={todo.id} initialValue={todo.completed} />
          {todo.title}
          <TodoDeleteButton id={todo.id} />
        </div>
      ))}
    </div>
  );
}
