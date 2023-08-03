"use client";

import { deleteTodo } from "@/server-actions";
import { useTransition } from "react";

interface TodoDeleteButtonProps {
  id: number;
}

export function TodoDeleteButton({ id }: TodoDeleteButtonProps) {
  const [isTransition, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      deleteTodo(id);
    });
  };

  return (
    <button onClick={handleClick}>
      {isTransition ? "Deleting..." : "Delete"}
    </button>
  );
}
