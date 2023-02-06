import { createContext, useContext, useState } from "react";
import { Wrapper } from "../components/Wrapper";

interface AppContextData {
  value: string;
  setValue: (value: string) => void;
}

const AppContext = createContext<AppContextData>({
  value: "",
  setValue: () => {},
});

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
  const { setValue } = useContext(AppContext);

  return (
    <Wrapper title="FormInput">
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
      <TextConsumer />
    </Wrapper>
  );
};

const Text = () => {
  const { value } = useContext(AppContext);
  return <Wrapper title="Text">{value}</Wrapper>;
};

const TextConsumer = () => {
  return (
    <AppContext.Consumer>
      {({ value }) => <Wrapper title="TextConsumer">{value}</Wrapper>}
    </AppContext.Consumer>
  );
};

export const Simple = () => {
  const [value, setValue] = useState("");

  return (
    <AppContext.Provider value={{ value, setValue }}>
      <Form />
      <TextDisplay />
    </AppContext.Provider>
  );
};
