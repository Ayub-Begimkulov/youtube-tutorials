import React from "react";

export {};

type CType = React.ComponentType;
//   ^?

let Component: CType = () => {
  return <div></div>;
};

Component = class Component extends React.Component {
  override render() {
    return <div></div>;
  }
};
