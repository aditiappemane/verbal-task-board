import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceInput from './VoiceInput';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import { parseNaturalLanguageTask } from '../utils/taskParser';
import { Mic, Plus, LayoutGrid, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  createdAt: Date;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const { toast } = useToast();

  const handleAddTask = (text: string) => {
    if (!text.trim()) return;

    try {
      const parsedTask = parseNaturalLanguageTask(text);
      const newTask: Task = {
        id: Date.now().toString(),
        ...parsedTask,
        createdAt: new Date(),
      };

      setTasks(prev => [newTask, ...prev]);
      setInputText('');
      
      toast({
        title: "Task Added Successfully",
        description: `"${parsedTask.name}" assigned to ${parsedTask.assignee}`,
      });
    } catch (error) {
      toast({
        title: "Error Parsing Task",
        description: "Please try rephrasing your task with clearer details.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your list.",
    });
  };

  const handleVoiceResult = (transcript: string) => {
    setInputText(transcript);
    setIsVoiceMode(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P4': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Task Manager
        </h1>
        <p className="text-gray-600 text-lg">
          Add tasks using natural language. Say things like "Call John tomorrow at 2pm" or "Finish report by Friday"
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="e.g., 'Finish landing page Aman by 11pm 20th June' or 'Call client Rajeev tomorrow 5pm'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask(inputText)}
                className="text-lg py-3 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                variant={isVoiceMode ? "default" : "ghost"}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={() => handleAddTask(inputText)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
              disabled={!inputText.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {isVoiceMode && (
            <VoiceInput
              onResult={handleVoiceResult}
              onClose={() => setIsVoiceMode(false)}
            />
          )}
        </div>
      </Card>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-blue-100">Total Tasks</div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="text-2xl font-bold">{tasks.filter(t => t.priority === 'P1').length}</div>
            <div className="text-red-100">High Priority</div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="text-2xl font-bold">
              {tasks.filter(t => new Date(t.dueDate) >= new Date()).length}
            </div>
            <div className="text-green-100">Upcoming</div>
          </Card>
        </div>
      )}

      {/* View Toggle and Tasks */}
      {tasks.length > 0 && (
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Tasks ({tasks.length})
            </h2>
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <TaskTable
              tasks={tasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>
        </Tabs>
      )}

      {tasks.length === 0 && (
        <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-dashed border-2 border-gray-300">
          <div className="text-gray-500 mb-4">
            <Plus className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p>Start by adding your first task using natural language above</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
