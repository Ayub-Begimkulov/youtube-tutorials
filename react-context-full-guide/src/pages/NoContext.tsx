import { useState } from "react";
import { Wrapper } from "../components/Wrapper";

interface FormProps extends FormInputProps {}

const Form = ({ setValue }: FormProps) => {
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <FormInput setValue={setValue} />
    </Wrapper>
  );
};

interface FormInputProps {
  setValue: (value: string) => void;
}

const FormInput = ({ setValue }: FormInputProps) => {
  return (
    <Wrapper title="FormInput">
      <input type="text" onChange={(e) => setValue(e.target.value)} />
    </Wrapper>
  );
};

interface TextDisplayProps extends TextProps {}

const TextDisplay = ({ value }: TextDisplayProps) => {
  return (
    <Wrapper
      title="TextDisplay"
      style={{
        height: 300,
        width: 300,
      }}
    >
      <Text value={value} />
    </Wrapper>
  );
};

interface TextProps {
  value: string;
}

const Text = ({ value }: TextProps) => {
  return <Wrapper title="Text">{value}</Wrapper>;
};

export const NoContext = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <Form setValue={setValue} />
      <TextDisplay value={value} />
    </>
  );
};
