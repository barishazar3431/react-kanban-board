import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Column, kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch, useAppSelector } from '../util/reduxHooks';
import KanbanColumn from './KanbanColumn';

function KanbanBoard() {
  const columns = useAppSelector((state) => state.kanban.columns);
  const columnIds = columns.map((column) => column.id);
  const dispatch = useAppDispatch();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  const handleAddColumn = () => {
    dispatch(kanbanActions.addColumn());
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'column') {
      setActiveColumn(event.active.data.current.column);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    const { active, over } = event;

    if (!over) return;

    const activeIndex = columns.findIndex((column) => column.id === active.id);
    const overIndex = columns.findIndex((column) => column.id === over.id);

    dispatch(kanbanActions.moveColumns({ from: activeIndex, to: overIndex }));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex items-center w-full max-w-[100rem] mx-auto">
        <div className="flex items-start min-w-full gap-3 overflow-x-scroll  pb-12">
          <SortableContext items={columnIds}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>
          <button
            onClick={handleAddColumn}
            className="bg-slate-900  whitespace-nowrap px-4 py-2 rounded-md border border-transparent hover:border-red-500 transition-all"
          >
            Add Column
          </button>
        </div>
        <DragOverlay>
          {activeColumn && <KanbanColumn column={activeColumn} />}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
