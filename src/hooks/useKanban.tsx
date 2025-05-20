import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

// Types
interface Task {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export const useKanbanBoard = (initialData: KanbanData) => {
  const [data, setData] = useState<KanbanData>(initialData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Find column that contains a task
  const findColumnOfTask = (taskId: string) => 
    Object.keys(data.columns).find(
      columnId => data.columns[columnId].taskIds.includes(taskId)
    ) || null;
  
  // Check if ID is a column
  const isColumnId = (id: string) => id in data.columns;
  
  // Event handlers
  const handleDragStart = ({ active }: DragStartEvent) => {
    const taskId = active.id as string;
    setActiveTask(data.tasks[taskId]);
  };
  
  // Handle dragging between columns - update immediately for visual feedback
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find columns
    const activeColumnId = findColumnOfTask(activeId);
    
    // Determine target column (either directly a column or derived from task)
    const overColumnId = isColumnId(overId) 
      ? overId 
      : findColumnOfTask(overId);
    
    // Only proceed if we have valid columns and they're different
    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return;
    }
    
    // Move the task between columns immediately
    setData(prev => {
      const newData = { ...prev };
      const columns = { ...newData.columns };
      
      // Remove from source column
      const sourceColumn = { ...columns[activeColumnId] };
      const sourceTaskIds = sourceColumn.taskIds.filter(id => id !== activeId);
      
      // Add to destination column
      const destColumn = { ...columns[overColumnId] };
      const destTaskIds = [...destColumn.taskIds];
      
      // If dropping on a task, insert after that task
      if (!isColumnId(overId) && destTaskIds.includes(overId)) {
        const overIndex = destTaskIds.indexOf(overId);
        destTaskIds.splice(overIndex + 1, 0, activeId);
      } else {
        // Otherwise add to the end
        destTaskIds.push(activeId);
      }
      
      // Update columns
      columns[activeColumnId] = { ...sourceColumn, taskIds: sourceTaskIds };
      columns[overColumnId] = { ...destColumn, taskIds: destTaskIds };
      
      // Return updated data
      return {
        ...newData,
        columns
      };
    });
  };
  
  // Handle reordering within the same column
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find columns
    const activeColumnId = findColumnOfTask(activeId);
    const overColumnId = isColumnId(overId) 
      ? overId 
      : findColumnOfTask(overId);
    
    // If we have valid columns and they're the same (reordering within column)
    if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
      // Only proceed if we're dropping on a task (not the column itself)
      if (!isColumnId(overId)) {
        setData(prev => {
          const newData = { ...prev };
          const columns = { ...newData.columns };
          const column = { ...columns[activeColumnId] };
          const taskIds = [...column.taskIds];
          
          // Get indices
          const oldIndex = taskIds.indexOf(activeId);
          const newIndex = taskIds.indexOf(overId);
          
          if (oldIndex !== newIndex) {
            // Use arrayMove for clean reordering
            column.taskIds = arrayMove(taskIds, oldIndex, newIndex);
            columns[activeColumnId] = column;
          }
          
          return {
            ...newData,
            columns
          };
        });
      }
    }
    
    setActiveTask(null);
  };
  
  // Task operations
  const addTask = (
    content: string, 
    priority: 'low' | 'medium' | 'high', 
    columnId: string = data.columnOrder[0] // Default to first column if not specified
  ) => {
    if (!content.trim()) return;
    
    const taskId = `task-${uuidv4()}`;
    
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { id: taskId, content, priority }
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: [...data.columns[columnId].taskIds, taskId]
        }
      }
    });
  };
  
  const deleteTask = (taskId: string) => {
    const columnId = findColumnOfTask(taskId);
    if (!columnId) return;
    
    const newData = { ...data };
    const columns = { ...newData.columns };
    const tasks = { ...newData.tasks };
    
    // Update column
    columns[columnId] = {
      ...columns[columnId],
      taskIds: columns[columnId].taskIds.filter(id => id !== taskId)
    };
    
    // Remove task
    delete tasks[taskId];
    
    setData({
      ...newData,
      columns,
      tasks
    });
  };
  
  // Column operations
  const addColumn = (title: string) => {
    if (!title.trim()) return;
    
    const columnId = `column-${uuidv4()}`;
    
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: { id: columnId, title, taskIds: [] }
      },
      columnOrder: [...data.columnOrder, columnId]
    });
  };
  
  const deleteColumn = (columnId: string) => {
    if (data.columnOrder.length <= 1) return;
    
    const newData = { ...data };
    const tasks = { ...newData.tasks };
    const columns = { ...newData.columns };
    
    // Remove tasks from this column
    data.columns[columnId].taskIds.forEach(taskId => {
      delete tasks[taskId];
    });
    
    // Remove column
    delete columns[columnId];
    
    setData({
      tasks,
      columns,
      columnOrder: data.columnOrder.filter(id => id !== columnId)
    });
  };
  
  return {
    data,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    addTask,
    deleteTask,
    addColumn,
    deleteColumn
  };
};