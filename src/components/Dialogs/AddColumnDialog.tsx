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

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (title: string) => void;
}

const AddColumnDialog: React.FC<AddColumnDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddColumn 
}) => {
  const [columnTitle, setColumnTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnTitle.trim()) {
      onAddColumn(columnTitle);
      setColumnTitle('');
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setColumnTitle('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Add New Column</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new column for your kanban board.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title" className="text-white">
                Column Title
              </Label>
              <Input
                id="column-title"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                placeholder="Enter column title"
                className="bg-gray-800 border-gray-700 text-white"
                autoFocus
              />
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
              Add Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnDialog;