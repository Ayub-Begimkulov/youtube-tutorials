"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function TodoSearch() {
  const [isTransition, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const query = value ? `?query=${value}` : "";

    startTransition(() => {
      router.push(`/todo-with-delete${query}`);
    });
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      {isTransition && <div>Loading...</div>}
    </div>
  );
}
