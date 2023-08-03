import { fetchTodos } from "@/server-actions";
import { TodoSearch } from "./TodoSearch";
import { TodoItem } from "./TodoItem";
import { sleep } from "@/utils/sleep";
import { DateDisplay } from "@/components/DateDisplay";

export default async function TodosApp(props: any) {
  const filter = props.searchParams.query;

  const todos = await fetchTodos(filter);
  await sleep(2_000);

  const renderTodos = () => {
    if (todos.length === 0) {
      return <div>Nothing found :(</div>;
    }

    return todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        dateDisplay={<DateDisplay date={todo.createdAt} />}
      />
    ));
  };

  return (
    <div>
      <TodoSearch searchResults={renderTodos()} />
    </div>
  );
}
