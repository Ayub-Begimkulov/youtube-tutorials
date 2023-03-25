interface ButtonProps {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Button = ({ className = "", onClick, children }: ButtonProps) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

<Button onClick={console.log}>text</Button>;

<Button onClick={console.log}>
  <span>text</span>
</Button>;

<Button onClick={console.log}>
  <strong>Test</strong> text
</Button>;
