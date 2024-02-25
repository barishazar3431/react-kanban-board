import { Column } from '../store/kanbanSlice';

type Props = {
  column: Column;
};

function KanbanColumn({ column }: Props) {
  return (
    <div
      key={column.id}
      className="bg-slate-800 min-w-72 h-full max-h[30rem] p-1 rounded-sm"
    >
      <div className="bg-slate-900 p-2">{column.title}</div>
    </div>
  );
}

export default KanbanColumn;
