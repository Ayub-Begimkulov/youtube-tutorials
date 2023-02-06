import { Component, createContext, useContext, useState } from "react";
import { Wrapper } from "../components/Wrapper";

interface AppContextData {
  value: string;
  setValue: (value: string) => void;
}

const AppContext = createContext<AppContextData | null>(null);

const AppProvider = AppContext.Provider;

interface AppConsumerProps {
  children: (data: AppContextData) => React.ReactElement;
}

const AppConsumer = (props: AppConsumerProps) => {
  const data = useAppContext();

  return props.children(data);
};

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

class FormInput extends Component {
  render() {
    return (
      <AppConsumer>
        {({ setValue }) => (
          <Wrapper title="FormInput">
            <input type="text" onChange={(e) => setValue(e.target.value)} />
          </Wrapper>
        )}
      </AppConsumer>
    );
  }
}

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

class Text extends Component {
  static contextType = AppContext;
  declare context: AppContextData /* React.ContextType<typeof AppContext> */;

  render() {
    const value = this.context!.value;

    return <Wrapper title="Text">{value}</Wrapper>;
  }
}

export const ClassComponents = () => {
  const [value, setValue] = useState("");

  return (
    <AppProvider value={{ value, setValue }}>
      <Form />
      <TextDisplay />
    </AppProvider>
  );
};
