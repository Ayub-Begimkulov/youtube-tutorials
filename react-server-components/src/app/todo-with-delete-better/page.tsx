import { fetchTodos } from "@/services";
import { TodoSearch } from "./TodoSearch";
import { TodoItem } from "./TodoItem";
import { sleep } from "@/utils/sleep";

export default async function TodosApp(props: any) {
  const filter = props.searchParams.query;

  const todos = await fetchTodos(filter);
  await sleep(2_000);

  const renderTodos = () => {
    if (todos.length === 0) {
      return <div>Nothing found :(</div>;
    }

    return todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
  };

  return (
    <div>
      <TodoSearch />
      {renderTodos()}
    </div>
  );
}
