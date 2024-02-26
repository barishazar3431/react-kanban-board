import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const isLastColumn = useAppSelector(
    (state) => state.kanban.columns.length === 1
  );
  const { tasks, id, title } = column;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const deleteColumnHandler = () => {
    dispatch(kanbanActions.deleteColumn(column.id));
  };

  const createTaskHandler = () => {
    dispatch(kanbanActions.addTaskToColumnById(column.id));
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-transparent w-72 min-w-72 h-[30rem] p-1 rounded-sm border border-red-500 z-0"
      ></div>
    );
  }

  return (
    <div
      className={`bg-slate-900 z-10 w-72 min-w-72 h-[30rem] p-1 border border-transparent cursor-grab active:cursor-grabbing rounded-sm flex flex-col  ${
        isDragging ? '' : ''
      }`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="bg-slate-950 p-2 flex items-center justify-between">
        <span className="font-bold text-md">{title}</span>
        {!isLastColumn && (
          <button
            className="text-lg text-neutral-500 hover:text-neutral-400 transition"
            onClick={deleteColumnHandler}
          >
            <RiDeleteBinLine />
          </button>
        )}
      </div>
      {tasks && (
        <div className="overflow-y-auto p-2 pr-3 flex flex-col gap-2">
          {tasks.map((task) => (
            <KanbanTaskItem task={task} columnId={id} />
          ))}
        </div>
      )}
      <div className="mt-auto">
        <button
          onClick={createTaskHandler}
          className="flex items-center gap-2 py-2 px-4 hover:text-white transition"
        >
          <FaPlusCircle />
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
