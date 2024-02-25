import { kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch, useAppSelector } from '../util/reduxHooks';
import KanbanColumn from './KanbanColumn';

function KanbanBoard() {
  const columns = useAppSelector((state) => state.kanban.columns);
  const dispatch = useAppDispatch();

  const handleAddColumn = () => {
    dispatch(kanbanActions.addColumn());
  };

  return (
    <div className="h-screen flex items-center px-56">
      <div className="flex items-start gap-3 overflow-x-scroll pb-12 h-[30rem]">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
        <button
          onClick={handleAddColumn}
          className="bg-slate-900  whitespace-nowrap px-4 py-2 rounded-md border border-transparent hover:border-red-500 transition-all"
        >
          Add Column
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
