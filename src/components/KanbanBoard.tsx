import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useKanbanBoard } from '../hooks/useKanban';
import ColumnComponent from './ColumnComponent';
import TaskItem from './TaskItem';
import { initialData } from '../data';
import AddTaskDialog from '../components/Dialogs/AddTaskDialog';
import AddColumnDialog from '../components/Dialogs/AddColumnDialog';
import { Button } from './Button';

const KanbanBoard: React.FC = () => {
  // Dialog states
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [activeColumnForTask, setActiveColumnForTask] = useState<string | null>(null);
  
  // Use our custom hook
  const {
    data,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    addTask,
    deleteTask,
    addColumn,
    deleteColumn
  } = useKanbanBoard(initialData);
  
  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Open add task dialog for a specific column
  const handleAddTaskClick = (columnId: string) => {
    setActiveColumnForTask(columnId);
    setIsAddTaskOpen(true);
  };
  
  // Handle adding a new task
  const handleAddTask = (content: string, priority: 'low' | 'medium' | 'high') => {
    if (activeColumnForTask) {
      addTask(content, priority, activeColumnForTask);
      setIsAddTaskOpen(false);
      setActiveColumnForTask(null);
    }
  };
  
  // Handle adding a new column
  const handleAddColumn = (title: string) => {
    addColumn(title);
    setIsAddColumnOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Kanban Board</h1>
      
      {/* Kanban board */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}   
      >
        <div className="flex overflow-x-auto pb-8 min-h-[400px] gap-4">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <div key={column.id} className="relative">
                <ColumnComponent 
                  column={column} 
                  tasks={tasks} 
                  onDeleteTask={deleteTask}
                />
                
                {/* Add task button at bottom of column */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-900 rounded-b-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 flex items-center"
                    onClick={() => handleAddTaskClick(column.id)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </div>
                
                {/* Column delete button */}
                {data.columnOrder.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteColumn(column.id)}
                    className="absolute top-3 right-3 h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          
          {/* Add column button */}
          <div className="w-80 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full h-12 flex items-center justify-center bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border-2 border-dashed border-gray-800 rounded-md"
              onClick={() => setIsAddColumnOpen(true)}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
        
        {/* Drag overlay */}
        <DragOverlay>
          {activeTask ? <TaskItem task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
      
      {/* Dialogs */}
      <AddTaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
      
      <AddColumnDialog 
        open={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
};

export default KanbanBoard;