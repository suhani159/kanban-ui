import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import type { Task } from '../types/Board';

interface SortableTaskProps {
  task: Task;
  onDelete: (id: string) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 p-3 bg-gray-800 rounded border-l-4 ${getPriorityBorder(task.priority)} shadow-sm cursor-grab active:cursor-grabbing group hover:bg-gray-750`}
    >
      <div className="flex justify-between">
        <p className="text-white text-sm">{task.content}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SortableTask;