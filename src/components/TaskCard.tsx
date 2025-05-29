
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from './TaskManager';
import EditableField from './EditableField';
import { Calendar, Clock, User, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, getPriorityColor }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white">
      <div className="space-y-4">
        {/* Header with priority and delete */}
        <div className="flex items-start justify-between">
          <Badge className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 -mt-2 -mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Task name */}
        <div>
          <EditableField
            value={task.name}
            onSave={(value) => onUpdate(task.id, { name: value })}
            className="text-lg font-semibold text-gray-900 leading-tight"
            placeholder="Task name"
          />
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4" />
          <EditableField
            value={task.assignee}
            onSave={(value) => onUpdate(task.id, { assignee: value })}
            className="font-medium"
            placeholder="Assignee"
          />
        </div>

        {/* Date and time */}
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
            <Calendar className="h-4 w-4" />
            <EditableField
              value={task.dueDate}
              onSave={(value) => onUpdate(task.id, { dueDate: value })}
              type="date"
              className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}
              displayValue={formatDate(task.dueDate)}
            />
          </div>
          {task.dueTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <EditableField
                value={task.dueTime}
                onSave={(value) => onUpdate(task.id, { dueTime: value })}
                placeholder="Time"
              />
            </div>
          )}
        </div>

        {/* Created date */}
        <div className="text-xs text-gray-400 border-t pt-2">
          Created: {task.createdAt.toLocaleString()}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
