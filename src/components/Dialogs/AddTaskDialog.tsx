import React, { useState } from 'react';
import { Button } from '../Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';


interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (content: string, priority: 'low' | 'medium' | 'high') => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddTask 
}) => {
  const [taskContent, setTaskContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskContent.trim()) {
      onAddTask(taskContent, priority);
      // Reset form
      setTaskContent('');
      setPriority('medium');
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setTaskContent('');
      setPriority('medium');
    }
    onOpenChange(newOpen);
  };

  const getPriorityStyle = (value: string) => {
    if (value === priority) {
      switch (value) {
        case 'high':
          return 'bg-red-900 text-white border-red-700';
        case 'medium':
          return 'bg-yellow-900 text-white border-yellow-700';
        case 'low':
          return 'bg-green-900 text-white border-green-700';
      }
    }
    return 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700';
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Add New Task</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new task for your kanban board.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-content" className="text-white">
                Task Description
              </Label>
              <Input
                id="task-content"
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                placeholder="Enter task description"
                className="bg-gray-800 border-gray-700 text-white"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-white">Priority</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className={`flex-1 ${getPriorityStyle('low')}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </Button>
                <Button
                  type="button"
                  className={`flex-1 ${getPriorityStyle('medium')}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  className={`flex-1 ${getPriorityStyle('high')}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;