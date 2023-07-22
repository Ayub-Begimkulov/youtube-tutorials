import { fetchTodos } from "@/services";
import { sleep } from "@/utils/sleep";
import { TodoCheckbox } from "./TodoCheckbox";

export default async function TodosApp() {
  const todos = await fetchTodos();
  await sleep(2_000);

  return (
    <div>
      {todos.map((todo) => {
        return (
          <div key={todo.id}>
            <TodoCheckbox todoId={todo.id} initialValue={todo.completed} />
            {/* <input
              type="checkbox"
              defaultChecked={todo.completed}
              onChange={async () => {
                "use server";
                await updateTodo(todo.id, { completed: !todo.completed });
              }}
            /> */}
            {todo.title}
          </div>
        );
      })}
    </div>
  );
}
