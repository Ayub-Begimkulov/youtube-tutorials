export {};

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
  onChange={(value) => console.log(value)}
/>;
