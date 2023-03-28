export {};

type ButtonElements = "button" | "a";

type ButtonProps<Type extends ButtonElements | React.ComponentType> = {
  variant: "default" | "danger";
  as?: Type;
} & ButtonAdditionalProps<Type>;

type ButtonAdditionalProps<Type extends ButtonElements | React.ComponentType> =
  Type extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[Type]
    : React.ComponentPropsWithoutRef<Type>;

const Button = <
  Type extends ButtonElements | React.ComponentType<any> = "button"
>({
  as,
  variant,
  ...rest
}: ButtonProps<Type>) => {
  const Component = as || "button";

  const props = {
    ...rest,
    className: `button--${variant} ${
      "className" in rest ? rest.className || "" : ""
    }`,
  };

  return <Component {...props} />;
};

<Button
  variant="default"
  onClick={(e) => {
    const ct = e.currentTarget;
    //    ^?
    console.log(ct);
  }}
>
  Click me
</Button>;

<Button
  variant="default"
  as="a"
  href="https://google.com"
  onClick={(e) => {
    const ct = e.currentTarget;
    //    ^?
    console.log(ct);
  }}
>
  Click me
</Button>;

interface ButtonWrapperProps {
  asdf: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const ButtonWrapper = ({ asdf, onClick, children }: ButtonWrapperProps) => {
  console.log(asdf);
  return <div onClick={onClick}>{children}</div>;
};

<Button
  variant="default"
  as={ButtonWrapper}
  asdf={5}
  onClick={(e) => {
    const ct = e.currentTarget;
    //    ^?
    console.log(ct);
  }}
>
  Click me
</Button>;
