import { createContext, useContext, useRef, useState } from "react";
import { Wrapper } from "../components/Wrapper";

const useRenderCount = () => {
  const count = useRef(0);

  count.current++;

  return count.current;
};

interface AppContextData {
  value: string;
  setValue: (value: string) => void;
}

const AppContext = createContext<AppContextData | null>(null);

const AppProvider = AppContext.Provider;

const useAppContext = () => {
  const data = useContext(AppContext);

  if (!data) {
    throw new Error("Can not `useAppContext` outside of the `AppProvider`");
  }

  return data;
};

const Form = () => {
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <FormInput />
    </Wrapper>
  );
};

const FormInput = () => {
  const { setValue } = useAppContext();
  const renderCount = useRenderCount();

  return (
    <Wrapper title="FormInput">
      <div>Render count: {renderCount}</div>
      <input type="text" onChange={(e) => setValue(e.target.value)} />
    </Wrapper>
  );
};

const TextDisplay = () => {
  return (
    <Wrapper
      title="TextDisplay"
      style={{
        height: 300,
        width: 300,
      }}
    >
      <Text />
    </Wrapper>
  );
};

const Text = () => {
  const { value } = useAppContext();
  const renderCount = useRenderCount();

  return (
    <Wrapper title="Text">
      Render Count: {renderCount}
      <div>{value}</div>
    </Wrapper>
  );
};

export const Issues = () => {
  const [value, setValue] = useState("");

  return (
    <AppProvider value={{ value, setValue }}>
      <Form />
      <TextDisplay />
    </AppProvider>
  );
};
