import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from './TaskManager';
import EditableField from './EditableField';
import { Calendar, Clock, User, Trash2, CheckCircle } from 'lucide-react';

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

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // If it already has AM/PM (with or without space), return as is
    if (/am|pm/i.test(timeString)) {
      return timeString.replace(/\s+/g, ' ').toUpperCase();
    }
    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes || '00'} ${period}`;
  };

  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${task.completed ? 'border-l-green-500 bg-green-50/50' : 'border-l-blue-500 bg-white'}`}>
      <div className="space-y-4">
        {/* Header with priority, completion, and delete */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={(checked) => onUpdate(task.id, { completed: !!checked })}
            />
            <EditableField
              value={task.priority}
              onSave={(value) => onUpdate(task.id, { priority: value as 'P1' | 'P2' | 'P3' | 'P4' })}
              fieldType="priority"
              disabled={task.completed}
            >
              <Badge className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
            </EditableField>
          </div>
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
            className={`text-lg font-semibold leading-tight ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            placeholder="Task name"
            disabled={task.completed}
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
            disabled={task.completed}
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
              disabled={task.completed}
            />
          </div>
          {task.dueTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <EditableField
                value={task.dueTime}
                onSave={(value) => onUpdate(task.id, { dueTime: value })}
                placeholder="Time"
                displayValue={formatTime(task.dueTime)}
                disabled={task.completed}
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
