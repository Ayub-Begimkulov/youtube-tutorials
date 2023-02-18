import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadTodosFn } from "../../../services";
import { getId } from "../../../utils";

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

export interface TodoState {
  items: TodoItem[];
  status: "init" | "loading" | "error" | "success";
}

const initialState: TodoState = {
  items: [],
  status: "init",
};

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<{ title: string }>) {
      state.items.push({
        id: getId(),
        title: action.payload.title,
        done: false,
      });
    },

    toggleTodoDone(state, action: PayloadAction<{ id: number }>) {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) {
        return;
      }

      item.done = !item.done;
    },

    deleteTodo(state, action: PayloadAction<{ id: number }>) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(loadTodosThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTodosThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(loadTodosThunk.rejected, (state) => {
        state.status = "error";
      }),
});

export const loadTodosThunk = createAsyncThunk("todo/get", () => {
  return loadTodosFn();
});

export const { reducer: todoReducer, actions: todoActions } = slice;
