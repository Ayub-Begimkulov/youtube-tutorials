export {};

type AnyFunction = (...args: any[]) => any;

interface DefineComponentOptions<
  Data extends Record<string, unknown>,
  Methods extends Record<string, AnyFunction>
> {
  data: Data;
  methods: Methods & ThisType<Data & Methods>;
}

function defineComponent<
  Data extends Record<string, unknown>,
  Methods extends Record<string, AnyFunction>
>({ data, methods }: DefineComponentOptions<Data, Methods>) {
  // --------
  // ......
  return { ...data, ...methods };
}

const instance = defineComponent({
  data: {
    count: 0,
    loading: false,
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
