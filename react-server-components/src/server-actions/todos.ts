"use server";

import { revalidatePath } from "next/cache";
import { request } from "@/utils";

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;
}

const deletedTodoIds = new Set<number>();

export async function fetchTodos(filterTitle?: string) {
  const params: Record<string, string | number> = {
    _limit: 10,
  };
  if (filterTitle) {
    params.title_like = filterTitle;
  }

  return request<TodoItem[]>("/todos", {
    params,
  }).then((todos) => {
    return todos
      .filter((todo) => !deletedTodoIds.has(todo.id))
      .map((todo) => ({ ...todo, createdAt: randomDate() }));
  });
}

export async function updateTodo(
  id: number,
  updateData: Partial<Omit<TodoItem, "id">>
) {
  return request<TodoItem>(`/todos/${id}`, {
    method: "PATCH",
    body: updateData,
  });
}

export async function deleteTodo(id: number) {
  deletedTodoIds.add(id);
  return request<void>(`/todos/${id}`, { method: "DELETE" }).then(() => {
    // I can write here what ever I want and it will work???
    revalidatePath("/todo");
  });
}

// ================
const dateFrom = new Date(2020, 0, 1);
const dateTo = new Date();

function randomDate() {
  const diff = dateTo.getTime() - dateFrom.getTime();

  return dateFrom.getTime() + Math.random() * diff;
}
