interface ExampleWrapperProps {
  children: React.ReactNode;
}

export function ExampleWrapper({ children }: ExampleWrapperProps) {
  return (
    <div
      style={{
        height: 1200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ height: 500, minWidth: "70%", overflow: "auto" }}>
        <div
          style={{
            height: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
