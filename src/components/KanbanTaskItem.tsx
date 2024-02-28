import { RiDeleteBinLine } from 'react-icons/ri';
import { Task, kanbanActions } from '../store/kanbanSlice';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch } from '../util/reduxHooks';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  task: Task;
  parentId?: string;
};

function KanbanTaskItem({ task, parentId }: Props) {
  const dispatch = useAppDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task-item',
      task,
      parentId,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const deleteTaskHandler = () => {
    dispatch(kanbanActions.deleteTaskById(task.id));
  };

  return (
    <div
      className={`bg-slate-950 min-h-20 z-30 rounded-xl p-2 flex items-center justify-between group border border-transparent hover:border-red-500 ${
        isDragging ? 'opacity-30' : ''
      }`}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <p className="text-sm text-white self-start">{task.content}</p>
      <button
        onClick={deleteTaskHandler}
        className="p-2 text-lg text-transparent group-hover:text-neutral-500 transition-all group/button"
      >
        <RiDeleteBinLine className="group-hover/button:text-neutral-400 block transition-all" />
      </button>
    </div>
  );
}

export default KanbanTaskItem;
