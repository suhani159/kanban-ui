import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTask from './SortableTask';
import type { Column, Task } from '../types/Board';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

const ColumnComponent: React.FC<ColumnProps> = ({ column, tasks, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Style to show when dragging over the column
  const columnStyle = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : '', // Light blue when dragging over
    transition: 'background-color 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      className="w-80 flex flex-col bg-gray-900 rounded-md shadow-md overflow-hidden h-[500px]" // Fixed height
      style={columnStyle}
    >
      {/* Column header */}
      <div className="p-3 flex justify-between items-center bg-gray-800">
        <div className="flex items-center">
          <span className="text-white font-medium">{column.title}</span>
          <span className="ml-2 bg-gray-700 text-gray-300 rounded-full px-2 py-0.5 text-xs">
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Column tasks - scrollable */}
      <div className="p-2 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(500px - 96px)' }}> {/* Subtract header and footer height */}
        <SortableContext 
          items={tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask} 
            />
          ))}
        </SortableContext>
      </div>
      
      {/* Add space for the add task button at the bottom */}
      <div className="h-10"></div>
    </div>
  );
};

export default ColumnComponent;