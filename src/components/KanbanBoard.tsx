import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { Column, Task, kanbanActions } from '../store/kanbanSlice';
import { useAppDispatch, useAppSelector } from '../util/reduxHooks';
import KanbanColumn from './KanbanColumn';
import KanbanTaskItem from './KanbanTaskItem';
import { getParentIdOfTask } from '../util/kanbanUtils';

function KanbanBoard() {
  const columns = useAppSelector((state) => state.kanban.columns);
  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const dispatch = useAppDispatch();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const handleAddColumn = () => {
    dispatch(kanbanActions.addColumn());
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current === undefined) return;
    const itemType = event.active.data.current.type;

    if (itemType === 'column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (itemType === 'task-item') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    if (event.active.data.current === undefined) return;
    const itemType = event.active.data.current.type;

    if (itemType === 'column') {
      const activeIndex = columns.findIndex(
        (column) => column.id === active.id
      );
      const overIndex = columns.findIndex((column) => column.id === over.id);

      dispatch(kanbanActions.moveColumns({ from: activeIndex, to: overIndex }));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveATaskItem = active.data.current?.type === 'task-item';
    if (!isActiveATaskItem) return;

    if (over.data.current?.type === 'task-item') {
      //Drag over an item
      const activeParentId = active.data.current?.parentId;
      const overParentId = over.data.current?.parentId;
      const activeId = active.data.current?.task.id;
      const overId = over.data.current?.task.id;
      if (activeParentId === overParentId) {
        dispatch(
          kanbanActions.swapItems({
            fromId: activeId,
            toId: overId,
            parentId: activeParentId,
          })
        );
      }
      return;
    }
    if (over.data.current?.type === 'column') {
      //Drag over a column
      const activeId = active.data.current?.task.id;
      const overId = over.data.current?.column.id;

      const activeParentId = getParentIdOfTask(columns, activeId);

      if (activeParentId === overId) return;

      dispatch(
        kanbanActions.moveTaskToColumn({
          columnId: overId,
          taskId: activeId,
        })
      );

      console.log('column');
    }
  };

  return (
    <div className="h-screen flex items-center w-full max-w-[100rem] mx-auto">
      <div className="flex items-start min-w-full gap-3 overflow-x-scroll  pb-12">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeColumn && <KanbanColumn column={activeColumn} />}
            {activeTask && <KanbanTaskItem task={activeTask} />}
          </DragOverlay>
        </DndContext>
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
