"use client";

import { useState } from "react";
import { updateTodo } from "@/server-actions";

interface TodoCheckboxProps {
  todoId: number;
  initialValue: boolean;
}

export function TodoCheckbox({ todoId, initialValue }: TodoCheckboxProps) {
  const [checked, setChecked] = useState(initialValue);

  const handleChange = async () => {
    try {
      const newChecked = !checked;
      setChecked(newChecked);
      await updateTodo(todoId, { completed: newChecked });
    } catch (error) {
      setChecked(checked);
    }
  };

  return <input type="checkbox" checked={checked} onChange={handleChange} />;
}
