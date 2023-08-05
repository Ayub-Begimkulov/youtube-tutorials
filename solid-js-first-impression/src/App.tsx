import { createEffect, createSignal, For } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Counter } from "./examples/Counter";
import { TodoList } from "./examples/TodoList";
import { TodoListSignals } from "./examples/TodoListSignals";

const examplesMap = {
  counter: Counter,
  todoList: TodoList,
  todoListSignals: TodoListSignals,
};

type ExampleType = keyof typeof examplesMap;

export const App = () => {
  const storageItem = sessionStorage.getItem("example");
  const initialExample =
    storageItem && storageItem in examplesMap
      ? (storageItem as ExampleType)
      : "counter";

  const [example, setExample] = createSignal<ExampleType>(initialExample);

  createEffect(() => {
    sessionStorage.setItem("example", example());
  });

  const examplesKeys = Object.keys(examplesMap) as ExampleType[];

  return (
    <>
      <header style="display: flex; gap: 12px;">
        <For each={examplesKeys}>
          {(exampleKey) => (
            <button onClick={() => setExample(exampleKey)}>{exampleKey}</button>
          )}
        </For>
      </header>

      <div style={`margin-top: 30px;`}>
        <Dynamic component={examplesMap[example()]} />
      </div>
    </>
  );
};
