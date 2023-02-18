import { makeAutoObservable } from "mobx";
import { TodoStore } from "./todo";

class RootStore {
  todos = new TodoStore();

  constructor() {
    makeAutoObservable(this);
  }
}

export type { RootStore };
export const store = new RootStore();
