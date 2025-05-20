import React from 'react';
import type { Task } from '../types/Board';

interface TaskItemProps {
  task: Task;
}

// This is a non-interactive version of the task used for the drag overlay
const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
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
    <div className={`p-3 mb-2 bg-gray-800 rounded border-l-4 ${getPriorityBorder(task.priority)} shadow opacity-80 w-64`}>
      <p className="text-white text-sm">{task.content}</p>
    </div>
  );
};

export default TaskItem;