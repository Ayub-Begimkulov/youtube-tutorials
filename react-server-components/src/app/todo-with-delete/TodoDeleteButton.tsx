"use client";

import { deleteTodo } from "@/services";

interface TodoDeleteButtonProps {
  id: number;
}

export function TodoDeleteButton({ id }: TodoDeleteButtonProps) {
  const handleClick = () => {
    deleteTodo(id);
  };

  return <button onClick={handleClick}>Delete</button>;
}
