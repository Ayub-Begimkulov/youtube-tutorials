import { useState } from "react";
import { useEvent } from "../../use-ref/slides/use-event";
import {
  PersistentStorage,
  localStorageWrapper,
  sessionStorageWrapper,
} from "./local-session-storage-wrapper";

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}

function createPersistentStateHooks(storage: PersistentStorage) {
  return function usePersistentState<Value>(
    name: string,
    initialValue: (() => Value) | Value
  ) {
    const [value, setValue] = useState(() => {
      if (storage.has(name)) {
        return storage.get(name) as Value;
      }

      return isFunction(initialValue) ? initialValue() : initialValue;
    });

    const setState = useEvent((newValue: React.SetStateAction<Value>) => {
      const actualNewValue = isFunction(newValue) ? newValue(value) : newValue;

      storage.set(name, actualNewValue);

      setValue(actualNewValue);
    });

    return [value, setState] as const;
  };
}

const useLocalStorage = createPersistentStateHooks(localStorageWrapper);
const useSessionStorage = createPersistentStateHooks(sessionStorageWrapper);

export function UseLocalSessionStorageExample() {
  const [localValue, setLocalValue] = useLocalStorage("local-state", "");
  const [sessionValue, setSessionValue] = useSessionStorage(
    "session-state",
    ""
  );

  return (
    <div>
      <h2>Local value</h2>
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        type="text"
      />
      <h2>Session value</h2>
      <input
        value={sessionValue}
        onChange={(e) => setSessionValue(e.target.value)}
        type="text"
      />
    </div>
  );
}
