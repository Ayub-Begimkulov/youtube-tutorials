export {};

interface SomeComponentProps {
  text?: string;
}

const SomeComponent = (props: SomeComponentProps) => {
  if (typeof props.text === "undefined") {
    return null;
  }

  const text = props.text;
  //     ^?

  return (
    <p>
      Here is the text: <br />
      {text}
    </p>
  );
};

<SomeComponent />;

const getSavedName = () => {
  const name = localStorage.getItem("name");
  //    ^?

  if (name === null) {
    return;
  }

  name;
  // ^?

  const parsedName = JSON.parse(name);
  //    ^?

  if (typeof parsedName !== "string") {
    return;
  }

  return parsedName;
  //     ^?
};

getSavedName();
