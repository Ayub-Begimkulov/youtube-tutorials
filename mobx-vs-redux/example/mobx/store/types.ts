export type FlowReturn<AsyncFunction extends (...args: any[]) => Promise<any>> =
  Generator<
    ReturnType<AsyncFunction>,
    void,
    Awaited<ReturnType<AsyncFunction>>
  >;
