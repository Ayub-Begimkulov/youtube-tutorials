"use client";

import {
  deleteTodo,
  updateTodo,
  type TodoItem as TodoItemType,
} from "@/server-actions";
import { useState, useTransition } from "react";

interface TodoItemProps {
  todo: TodoItemType;
  dateDisplay: React.ReactNode;
}

export const TodoItem = ({ todo, dateDisplay }: TodoItemProps) => {
  const [isDeletingTransition, startDeletingTransition] = useTransition();
  const [checked, setChecked] = useState(todo.completed);

  const handleClick = () => {
    startDeletingTransition(() => {
      deleteTodo(todo.id);
    });
  };

  const handleChange = async () => {
    try {
      const newChecked = !checked;
      setChecked(newChecked);
      await updateTodo(todo.id, { completed: newChecked });
    } catch (error) {
      setChecked(checked);
    }
  };

  return (
    <div key={todo.id} style={{ opacity: isDeletingTransition ? 0.5 : 1 }}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {todo.title}
      {dateDisplay}
      <button onClick={handleClick}>
        {isDeletingTransition ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};
