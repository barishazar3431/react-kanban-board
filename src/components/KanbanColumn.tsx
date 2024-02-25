import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Column, kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch, useAppSelector } from '../util/reduxHooks';
import KanbanTaskItem from './KanbanTaskItem';

type Props = {
  column: Column;
};

function KanbanColumn({ column }: Props) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(
    (state) => state.kanban.columns.find((item) => item.id === column.id)?.tasks
  );

  const deleteColumnHandler = () => {
    dispatch(kanbanActions.deleteColumn(column.id));
  };

  const createTaskHandler = () => {
    dispatch(kanbanActions.addTaskToColumnById(column.id));
  };

  return (
    <div
      key={column.id}
      className="bg-slate-900 w-72 min-w-72 h-full max-h[30rem] p-1 rounded-sm flex flex-col"
    >
      <div className="bg-slate-950 p-2 flex items-center justify-between">
        <span className="font-bold text-md">{column.title}</span>
        <button
          className="text-lg text-neutral-500 hover:text-neutral-400"
          onClick={deleteColumnHandler}
        >
          <RiDeleteBinLine />
        </button>
      </div>
      {tasks && (
        <div className="overflow-scroll p-2 pr-3 flex flex-col gap-2">
          {tasks.map((task) => (
            <KanbanTaskItem task={task} columnId={column.id} />
          ))}
        </div>
      )}
      <div className="mt-auto py-2 px-4">
        <button onClick={createTaskHandler} className="flex items-center gap-2">
          <FaPlusCircle />
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
