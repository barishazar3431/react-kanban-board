import { arrayMove } from '@dnd-kit/sortable';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uniqid from 'uniqid';

export type Task = {
  id: string;
  content: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type Board = {
  columns: Column[];
};

const initialState: Board = {
  columns: [
    { id: uniqid(), title: 'Todo', tasks: [] },
    { id: uniqid(), title: 'Work in Progress', tasks: [] },
    { id: uniqid(), title: 'Done', tasks: [] },
  ],
};

const kanbanSlice = createSlice({
  name: 'kanban-slice',
  initialState: initialState,
  reducers: {
    addColumn: (state) => {
      const id = uniqid();

      state.columns.push({
        id,
        title: `Column ${state.columns.length + 1}`,
        tasks: [],
      });
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      const removeId = action.payload;
      state.columns = state.columns.filter((column) => column.id !== removeId);
    },
    addTaskToColumnById: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      const newTask: Task = {
        content: 'New Task',
        id: uniqid(),
      };

      const column = state.columns.find((column) => column.id === columnId);
      if (!column) return;
      column.tasks.push(newTask);
    },
    deleteTaskById: (
      state,
      action: PayloadAction<{ taskId: string; columnId: string }>
    ) => {
      const { taskId, columnId } = action.payload;

      const column = state.columns.find((column) => column.id === columnId);
      if (!column) return;

      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    },
    moveColumns: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      state.columns = arrayMove(state.columns, from, to);
    },
  },
});

export default kanbanSlice;
export const kanbanActions = kanbanSlice.actions;
