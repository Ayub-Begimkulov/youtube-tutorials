import { fetchTodos } from "@/server-actions";
import { sleep } from "@/utils";
import { DateDisplay } from "@/components/DateDisplay";

export default async function TodosApp() {
  const todos = await fetchTodos();

  await sleep(2_000);

  return (
    <div>
      {todos.map((todo) => {
        return (
          <div key={todo.id}>
            <div>
              <input type="checkbox" defaultChecked={todo.completed} />
              {todo.title}
              <DateDisplay date={todo.createdAt} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
