
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Task } from './TaskManager';
import EditableField from './EditableField';
import { Trash2 } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onUpdate, onDelete, getPriorityColor }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    
    // If it already has AM/PM, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
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
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900 w-16">Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Task</TableHead>
            <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
            <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Time</TableHead>
            <TableHead className="font-semibold text-gray-900">Priority</TableHead>
            <TableHead className="font-semibold text-gray-900">Created</TableHead>
            <TableHead className="font-semibold text-gray-900 w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className={`hover:bg-gray-50 transition-colors ${task.completed ? 'bg-green-50/30' : ''}`}>
              <TableCell>
                <Checkbox 
                  checked={task.completed}
                  onCheckedChange={(checked) => onUpdate(task.id, { completed: !!checked })}
                />
              </TableCell>
              <TableCell className="font-medium">
                <EditableField
                  value={task.name}
                  onSave={(value) => onUpdate(task.id, { name: value })}
                  className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                  placeholder="Task name"
                  disabled={task.completed}
                />
              </TableCell>
              <TableCell>
                <EditableField
                  value={task.assignee}
                  onSave={(value) => onUpdate(task.id, { assignee: value })}
                  className="text-gray-700"
                  placeholder="Assignee"
                  disabled={task.completed}
                />
              </TableCell>
              <TableCell>
                <EditableField
                  value={task.dueDate}
                  onSave={(value) => onUpdate(task.id, { dueDate: value })}
                  type="date"
                  className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-700'}`}
                  displayValue={formatDate(task.dueDate)}
                  disabled={task.completed}
                />
              </TableCell>
              <TableCell>
                <EditableField
                  value={task.dueTime}
                  onSave={(value) => onUpdate(task.id, { dueTime: value })}
                  className="text-gray-700"
                  placeholder="Set time"
                  displayValue={formatTime(task.dueTime)}
                  disabled={task.completed}
                />
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {task.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TaskTable;
