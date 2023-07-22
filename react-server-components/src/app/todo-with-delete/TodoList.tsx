"use client";

import { TodoItem } from "@/services/api/todos";
import { TodoCheckbox } from "./TodoCheckbox";
import { TodoDeleteButton } from "./TodoDeleteButton";

interface TodoListProps {
  todos: TodoItem[];
}

export function TodoList({ todos }: TodoListProps) {
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
