import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadTodosFn } from "../../../services";
import { getId } from "../../../utils";

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

export interface TodoState {
  itemsMap: Record<string, TodoItem>;
  itemIds: number[];
  status: "init" | "loading" | "error" | "success";
}

const initialState: TodoState = {
  itemsMap: {},
  itemIds: [],
  status: "init",
};

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<{ title: string }>) {
      const id = getId();

      state.itemsMap[id] = {
        id,
        title: action.payload.title,
        done: false,
      };
      state.itemIds.push(id);
    },

    toggleTodoDone(state, action: PayloadAction<{ id: number }>) {
      const item = state.itemsMap[action.payload.id];

      if (!item) {
        return;
      }

      item.done = !item.done;
    },

    deleteTodo(state, action: PayloadAction<{ id: number }>) {
      delete state.itemsMap[action.payload.id];
      state.itemIds = state.itemIds.filter(
        (itemId) => itemId !== action.payload.id
      );
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(loadTodosThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTodosThunk.fulfilled, (state, action) => {
        state.status = "success";
        action.payload.forEach((item) => {
          state.itemsMap[item.id] = item;
          state.itemIds.push(item.id);
        });
      })
      .addCase(loadTodosThunk.rejected, (state) => {
        state.status = "error";
      }),
});

export const loadTodosThunk = createAsyncThunk("todo/get", () => {
  return loadTodosFn();
});

export const { reducer: todoReducer, actions: todoActions } = slice;
