import type { store } from "./root";

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
