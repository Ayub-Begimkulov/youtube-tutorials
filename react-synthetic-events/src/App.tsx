import ReactDOM from "react-dom";
import { modalRoot } from "./constants";

export const App = () => {
  const handleClick = () => {
    console.log("app click");
  };
  return (
    <div onClick={handleClick}>
      parent
      <Modal />
    </div>
  );
};

const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: 300,
  background: "#737373",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Modal = () => {
  const handleClick = () => {
    console.log("modal click");
  };
  return ReactDOM.createPortal(
    <div onClick={handleClick} style={modalStyles}>
      Modal
    </div>,
    modalRoot
  );
};
