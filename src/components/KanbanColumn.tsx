import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import useEditable from '../hooks/useEditable';
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
  const { handleBlur, handleKeyDown, isEditable, setIsEditable } =
    useEditable();

  const { tasks, id, title } = column;

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

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

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newTitle = event.currentTarget.value;
    dispatch(
      kanbanActions.renameColumn({
        columnId: id,
        newTitle,
      })
    );
  };

  return (
    <div
      className={`bg-slate-900 z-10 w-72 min-w-72 h-[30rem] p-1 cursor-grab active:cursor-grabbing rounded-sm  flex flex-col  ${
        isDragging ? 'opacity-50 z-0' : ''
      }`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        onClick={() => setIsEditable(true)}
        onBlur={handleBlur}
        className="bg-slate-950 p-2 flex items-center justify-between min-h-10"
      >
        <div className="cursor-text">
          {isEditable && (
            <input
              onChange={handleInputChange}
              type="text"
              className="font-bold text-md w-full h-[1.2rem] bg-slate-950 border-none  outline-none"
              defaultValue={title}
              autoFocus={true}
              onKeyDown={handleKeyDown}
            />
          )}
          {!isEditable && (
            <span className="font-bold text-md text-wrap break-words">
              {title}
            </span>
          )}
        </div>
        {!isLastColumn && (
          <button
            className="text-lg text-neutral-500 hover:text-neutral-400 transition"
            onClick={deleteColumnHandler}
          >
            <RiDeleteBinLine />
          </button>
        )}
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks && (
          <div className="overflow-y-auto p-2 pr-3 flex flex-col gap-2">
            {tasks.map((task) => (
              <KanbanTaskItem key={task.id} task={task} parentId={column.id} />
            ))}
          </div>
        )}
      </SortableContext>
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
