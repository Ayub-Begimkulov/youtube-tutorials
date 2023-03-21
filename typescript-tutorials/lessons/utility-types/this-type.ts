export {};

type AnyFunction = (...args: any[]) => any;

interface DefineComponentOptions<
  Data extends Record<string, unknown>,
  Methods extends Record<string, AnyFunction>
> {
  data: Data;
  methods: Methods;
}

function defineComponent<
  Data extends Record<string, unknown>,
  Methods extends Record<string, AnyFunction>
>({ data, methods }: DefineComponentOptions<Data, Methods>) {
  // --------
  // ......
  return { ...data, ...methods };
}

const componentInstance = defineComponent({
  data: {
    count: 0,
  },
  methods: {
    increment() {},
    decrement() {},
  },
});
