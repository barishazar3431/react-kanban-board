import { Column } from '../store/kanbanSlice';

export const getParentIdOfTask = (columns: Column[], taskId: string) => {
  let parentId: string = '';

  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns[i].tasks.length; j++) {
      if (columns[i].tasks[j].id === taskId) {
        parentId = columns[i].id;
      }
    }
  }
  return parentId;
};
