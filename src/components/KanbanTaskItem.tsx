import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticEvent } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import useEditable from '../hooks/useEditable';
import { Task, kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch } from '../util/reduxHooks';

type Props = {
  task: Task;
  parentId?: string;
};

function KanbanTaskItem({ task, parentId }: Props) {
  const dispatch = useAppDispatch();
  const { handleBlur, handleKeyDown, isEditable, setIsEditable } =
    useEditable();
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

  const deleteTaskHandler = (event: SyntheticEvent) => {
    event.stopPropagation();
    dispatch(kanbanActions.deleteTaskById(task.id));
  };

  const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value;
    dispatch(
      kanbanActions.renameTask({
        taskId: task.id,
        newContent: newContent,
      })
    );
  };

  // Necessary to put the cursor at the end when focusing (otherwise it is at the beginning)
  const handleInputFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    event.target.value = '';
    event.target.value = value;
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
      onClick={() => setIsEditable(true)}
      onBlur={handleBlur}
    >
      {!isEditable && (
        <p className="text-sm text-white self-start">{task.content}</p>
      )}
      {isEditable && (
        <textarea
          className="w-full text-sm h-[3.9rem] outline-none bg-slate-950 resize-none"
          defaultValue={task.content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoFocus={true}
        />
      )}
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
