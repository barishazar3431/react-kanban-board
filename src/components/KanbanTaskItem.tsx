import { RiDeleteBinLine } from 'react-icons/ri';
import { Task, kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch } from '../util/reduxHooks';

type Props = {
  task: Task;
  columnId: string;
};

function KanbanTaskItem({ task, columnId }: Props) {
  const dispatch = useAppDispatch();

  const deleteTaskHandler = () => {
    dispatch(
      kanbanActions.deleteTaskById({
        columnId,
        taskId: task.id,
      })
    );
  };

  return (
    <div
      key={task.id}
      className="bg-slate-950 min-h-20  rounded-xl p-2 flex items-center justify-between group border border-transparent hover:border-red-500"
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
