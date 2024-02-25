import { configureStore } from '@reduxjs/toolkit';
import kanbanSlice from './kanbanSlice';

const store = configureStore({
  reducer: {
    kanban: kanbanSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
