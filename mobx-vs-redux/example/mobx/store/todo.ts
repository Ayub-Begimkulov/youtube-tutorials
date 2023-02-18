import { makeAutoObservable } from "mobx";
import { loadTodosFn } from "../../services";
import { getId } from "../../utils";
import { FlowReturn } from "./types";

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

export class TodoStore {
  items: TodoItem[] = [];
  status: "init" | "loading" | "success" | "error" = "init";

  constructor() {
    makeAutoObservable(this);
  }

  addTodo({ title }: { title: string }) {
    this.items.push({
      id: getId(),
      title: title,
      done: false,
    });
  }

  deleteTodo({ id }: { id: number }) {
    const index = this.items.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
  }

  toggleTodoDone({ id }: { id: number }) {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      return;
    }

    item.done = !item.done;
  }

  *fetchTodos(): FlowReturn<typeof loadTodosFn> {
    try {
      this.status = "loading";

      const result = yield loadTodosFn();

      this.items = result;
      this.status = "success";
    } catch (error) {
      this.status = "error";
      console.error(error);
    }
  }
}
