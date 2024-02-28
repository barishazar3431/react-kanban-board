import { arrayMove } from '@dnd-kit/sortable';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uniqid from 'uniqid';
import { getParentIdOfTask } from '../util/kanbanUtils';

export type Task = {
  id: string;
  content: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Board = {
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
    deleteTaskById: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;

      state.columns.forEach((column) => {
        column.tasks = column.tasks.filter((task) => task.id !== taskId);
      });
    },
    moveColumns: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      state.columns = arrayMove(state.columns, from, to);
    },
    swapItems: (
      state,
      action: PayloadAction<{
        fromId: string;
        toId: string;
        parentId: string;
      }>
    ) => {
      const { fromId, toId, parentId } = action.payload;

      const parentIndex = state.columns.findIndex(
        (column) => column.id === parentId
      );
      const fromIndex = state.columns[parentIndex].tasks.findIndex(
        (task) => task.id === fromId
      );
      const toIndex = state.columns[parentIndex].tasks.findIndex(
        (task) => task.id === toId
      );

      state.columns[parentIndex].tasks = arrayMove(
        state.columns[parentIndex].tasks,
        fromIndex,
        toIndex
      );
    },
    moveTaskToColumn: (
      state,
      action: PayloadAction<{ taskId: string; columnId: string }>
    ) => {
      const { taskId, columnId } = action.payload;

      const columnIndex = state.columns.findIndex(
        (column) => column.id === columnId
      );
      const taskParentId = getParentIdOfTask(state.columns, taskId);

      const taskParentIndex = state.columns.findIndex(
        (column) => column.id === taskParentId
      );

      const task = state.columns[taskParentIndex].tasks.find(
        (task) => task.id === taskId
      );

      if (!task) return;

      state.columns[taskParentIndex].tasks = state.columns[
        taskParentIndex
      ].tasks.filter((task) => task.id !== taskId);
      state.columns[columnIndex].tasks.push(task);
    },
  },
});

export default kanbanSlice;
export const kanbanActions = kanbanSlice.actions;
