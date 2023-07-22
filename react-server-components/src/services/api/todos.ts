"use server";

import { request } from "./request";

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchTodos() {
  return request<TodoItem[]>("/todos", { params: { _limit: 10 } });
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
  return request<void>(`/todos/${id}`, { method: "DELETE" });
}
