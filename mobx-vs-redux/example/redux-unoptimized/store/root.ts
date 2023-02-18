import { configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "./slices";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});
