import { ReactNode } from "react";

interface WrapperProps {
  title: string;
  as?: "div" | "form";
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Wrapper = ({
  title,
  as: Component = "div",
  style,
  children,
}: WrapperProps) => {
  return (
    <Component
      style={{
        border: "1px solid lightgrey",
        padding: 8,
        margin: "8px 0",
        ...style,
      }}
    >
      <h3>{title}</h3>
      {children}
    </Component>
  );
};
