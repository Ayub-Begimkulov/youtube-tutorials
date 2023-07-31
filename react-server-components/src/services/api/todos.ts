"use server";

import { revalidatePath } from "next/cache";
import { request } from "./request";
import { sleep } from "@/utils/sleep";

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

const deletedTodoIds = new Set<number>();

export async function fetchTodos(filterTitle?: string) {
  const params: Record<string, string | number> = {
    _limit: 10,
  };
  if (filterTitle) {
    params.title_like = filterTitle;
  }

  await sleep(2000);

  return request<TodoItem[]>("/todos", {
    params,
  }).then((todos) => {
    return todos.filter((todo) => !deletedTodoIds.has(todo.id));
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
    revalidatePath("");
  });
}
