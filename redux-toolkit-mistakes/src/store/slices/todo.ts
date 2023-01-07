import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadTodosFn } from "../services";
import { getId } from "../utils";

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

interface TodoState {
  items: TodoItem[];
  // not using statuses!
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
    // ERROR! mutate everything, no need to worry
    addTodo(state, action: PayloadAction<{ title: string }>) {
      /* state.items = [
        ...state.items,
        {
          id: getId(),
          title: action.payload.title,
          done: false,
        },
      ]; */
      state.items.push({
        id: getId(),
        title: action.payload.title,
        done: false,
      });
    },

    toggleTodoDone(state, action: PayloadAction<{ id: number }>) {
      /* const newItems = state.items.map((item) => {
        if (item.id !== action.payload.id) {
          return item;
        }

        return { ...item, done: !item.done };
      });

      return { ...state, items: newItems }; */

      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) {
        return;
      }

      item.done = !item.done;
    },

    deleteTodo(state, action: PayloadAction<{ id: number }>) {
      // const newItems = state.items.filter(
      //   (item) => item.id !== action.payload.id
      // );

      // return { ...state, items: newItems };

      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index === -1) {
        return;
      }

      state.items.splice(index, 1);
    },
  },

  // ERROR! using custom thunks with createAsyncThunk
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

// ERROR! todo correct export of hole actions, not only one action!
export const { reducer: todoReducer, actions: todoActions } = slice;
// export const todoReducer = slice.reducer;
// export const { addTodo, toggleTodoDone, deleteTodo } = slice.actions;
