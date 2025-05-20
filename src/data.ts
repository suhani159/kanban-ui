import type { KanbanData } from "./types/Board";

export const initialData: KanbanData = {
    tasks: {
      'task-1': { id: 'task-1', content: 'Create login page', priority: 'high' },
      'task-2': { id: 'task-2', content: 'Design database schema', priority: 'medium' },
      'task-3': { id: 'task-3', content: 'API integration', priority: 'high' },
      'task-4': { id: 'task-4', content: 'Write documentation', priority: 'low' },
      'task-5': { id: 'task-5', content: 'Unit testing', priority: 'medium' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: ['task-5'],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };