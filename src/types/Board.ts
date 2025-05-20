export interface Task {
    id: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
  }
  
export interface Column {
    id: string;
    title: string;
    taskIds: string[];
  }
  
export  interface KanbanData {
    tasks: {
      [key: string]: Task;
    };
    columns: {
      [key: string]: Column;
    };
    columnOrder: string[];
  }