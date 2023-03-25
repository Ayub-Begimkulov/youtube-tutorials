export {};

const Component = () => {
  return <div></div>;
};

let reactElement: React.ReactElement = <div />;
let jsxElement: JSX.Element = <div />;

jsxElement = <Component />;
reactElement = <Component />;

reactElement = null;
jsxElement = null;
reactElement = "asdfadsf";
jsxElement = "adsfadf";
reactElement = 5;
jsxElement = 5;

let reactElementExact: React.ReactElement<
  JSX.IntrinsicElements["span"],
  "span"
> = <span />;

const divElement = <div />;
//    ^?

reactElementExact = divElement;
