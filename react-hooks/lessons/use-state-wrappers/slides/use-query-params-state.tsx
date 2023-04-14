import { useState } from "react";
import { useEvent } from "../../use-ref/slides/use-event";
import { isFunction } from "../utils";

function getSearchParam(search: string, param: string) {
  const searchParams = new URLSearchParams(search);
  return searchParams.get(param);
}

function setSearchParam(search: string, param: string, value: string) {
  const searchParams = new URLSearchParams(search);
  searchParams.set(param, value);
  return searchParams.toString();
}

const defaultDeserialize = <Value,>(v: string | null) => v as Value;
const defaultSerialize = String;

interface UseSearchParamsStateOptions<Value> {
  name: string;
  serialize?: (value: Value) => string;
  deserialize?: (value: string | null) => Value;
}

function useSearchParamsState<Value>({
  name,
  serialize = defaultSerialize,
  deserialize = defaultDeserialize,
}: UseSearchParamsStateOptions<Value>) {
  const [value, setValue] = useState(() => {
    const initialValue = deserialize(getSearchParam(location.search, name));

    return initialValue;
  });

  const updateValue = useEvent((newValue: React.SetStateAction<Value>) => {
    const search = window.location.search;
    const actualNewValue = isFunction(newValue) ? newValue(value) : newValue;

    setValue(actualNewValue);

    const newSearch = setSearchParam(search, name, serialize(actualNewValue));

    history.pushState(null, "", `?${newSearch}`);
  });

  return [value, updateValue] as const;
}

const PARAM_NAME = "name";

export function UseSearchParamsStateExample() {
  const [value, setValue] = useSearchParamsState({
    name: PARAM_NAME,
    deserialize: (v) => v || "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValue(value);
  };

  return (
    <div>
      <input value={value} onChange={onChange} placeholder="Name" />
    </div>
  );
}
