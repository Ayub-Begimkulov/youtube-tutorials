import { getId } from "../utils";

export const loadTodosFn = () => {
  const todos = [
    { id: getId(), title: "Cook dinner", done: false },
    { id: getId(), title: "Work", done: false },
    { id: getId(), title: "Buy bread", done: false },
    { id: getId(), title: "Do something", done: false },
  ];

  return new Promise<typeof todos>((res) => {
    setTimeout(() => {
      res(todos);
    }, 1000);
  });
};
