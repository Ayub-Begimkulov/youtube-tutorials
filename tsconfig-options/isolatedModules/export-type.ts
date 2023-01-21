import { Test } from "./some-type";

// can only use a export type
export { Test };

// this will not work also
export { Test as Test2 } from "./some-type";
