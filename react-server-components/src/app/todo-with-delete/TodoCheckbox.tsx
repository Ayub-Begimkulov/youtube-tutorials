"use client";

import { updateTodo } from "@/services";
import { useState } from "react";

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
