import { useState } from "react";

const DELTA_MULTIPLIER = -0.01;
const wrapperStyles = {
  width: 600,
  height: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const itemStyles = {
  width: 100,
  height: 100,
  background: "#cdf",
  padding: 8,
};

export const IncreaseElement = () => {
  const [scale, setScale] = useState(1);

  const handleWheel = (event: React.WheelEvent) => {
    let newScale = scale + event.deltaY * DELTA_MULTIPLIER;

    newScale = Math.min(Math.max(0.5, newScale), 4);

    setScale(newScale);
  };

  return (
    <div style={wrapperStyles}>
      <div
        onWheel={handleWheel}
        style={{
          ...itemStyles,
          transform: `scale(${scale})`,
        }}
      ></div>
    </div>
  );
};
