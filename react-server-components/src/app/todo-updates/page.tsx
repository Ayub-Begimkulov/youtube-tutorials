import { fetchTodos } from "@/server-actions";
import { sleep } from "@/utils/sleep";
import { TodoCheckbox } from "./TodoCheckbox";
import { TodoDeleteButton } from "./TodoDeleteButton";
import { TodoSearch } from "./TodoSearch";
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
      <div key={todo.id}>
        <TodoCheckbox todoId={todo.id} initialValue={todo.completed} />
        {todo.title}
        <DateDisplay date={todo.createdAt} />
        <TodoDeleteButton id={todo.id} />
      </div>
    ));
  };

  return (
    <div>
      <TodoSearch />
      {renderTodos()}
    </div>
  );
}
