export {};

/* const GenericNotWorking = <T>({ value }: { value: T }) => {
  //                      ^^^
  // JSX element 'T' has no corresponding closing tag.ts(17008)
  return <div>{JSON.stringify(value)}</div>;
};
 */

const GenericWorking = <T,>({ value }: { value: T }) => {
  return <div>{JSON.stringify(value)}</div>;
};

<GenericWorking value={5} />;

interface GenericComponentProps<Option extends string> {
  options: Option[];
  onChange: (value: Option) => void;
}

const GenericComponent = <Option extends string>({
  options,
  onChange,
}: GenericComponentProps<Option>) => {
  return (
    <div>
      {options.map((option) => (
        <div key={option} onClick={() => onChange(option)}>
          {option}
        </div>
      ))}
    </div>
  );
};

<GenericComponent
  options={["asdf", "test", "hello"]}
  onChange={(value) => {
    value;
    // ^?
    console.log(value);
  }}
/>;

<GenericComponent<string>
  options={["asdf", "test", "hello"]}
  onChange={(value) => {
    value;
    // ^?
    console.log(value);
  }}
/>;
