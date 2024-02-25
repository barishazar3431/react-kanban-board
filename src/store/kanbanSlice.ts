import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type Task = {
  id: number;
  content: string;
};

export type Column = {
  id: number;
  title?: string;
  tasks?: Task[];
};

type Board = {
  columns: Column[];
};

const initialState: Board = {
  columns: [],
};

const kanbanSlice = createSlice({
  name: 'kanban-slice',
  initialState: initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.columns.push({ id, title: `Column ${id}`, tasks: [] });
    },
  },
});

export default kanbanSlice;
export const kanbanActions = kanbanSlice.actions;
