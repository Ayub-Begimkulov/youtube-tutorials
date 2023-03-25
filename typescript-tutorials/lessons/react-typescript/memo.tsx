import { memo } from "react";

interface GenericComponentProps<Value> {
  id: number;
  title: string;
  value: Value;
}

function GenericComponent<Value>(props: GenericComponentProps<Value>) {
  console.log(props);
  return <div></div>;
}

const MemoGenericComponent = memo(GenericComponent);
// React.MemoExoticComponent<(<Value>(props: GenericComponentProps<Value>) => JSX.Element)>

<MemoGenericComponent<number> title="asdf" id={5} value="asdf" />;
//                    ^^^^^^
// Expected 0 type arguments, but got 1.ts(2558)

const typedMemo: <Component extends React.FC<any>>(
  component: Component,
  compare?: (
    prevProps: React.ComponentPropsWithoutRef<Component>,
    newProps: React.ComponentPropsWithoutRef<Component>
  ) => boolean
) => Component = memo;

const TypedMemoGenericComponent = typedMemo(GenericComponent);
//    ^?

<TypedMemoGenericComponent<string> title="asdf" id={5} value="asdf" />;

const TypedMemoGenericComponent2 = typedMemo(GenericComponent, (prev, next) => {
  prev;
  // ^?
  next;
  // ^?
  return false;
});

<TypedMemoGenericComponent2<string> title="asdf" id={5} value="asdf" />;
