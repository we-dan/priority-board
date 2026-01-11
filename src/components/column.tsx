import { useState } from 'react';
import { TaskCard } from './task-card';
import { AddTaskForm } from './add-task-form';
import type { Task, Column as ColumnType, ColumnId } from '@/types/task';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (title: string, description: string, timeframe: string, columnId: ColumnId) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: ColumnId) => void;
}

export function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, column.id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          {column.title}
        </h2>
        <div className="mt-1.5 text-xs text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 rounded-xl bg-muted/20 p-3 transition-all duration-200 ${
          isDragOver ? 'bg-muted/40 ring-2 ring-primary/50 shadow-lg scale-[1.01]' : ''
        }`}
      >
        <div className="space-y-3 mb-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>

        <AddTaskForm columnId={column.id} onAddTask={onAddTask} />
      </div>
    </div>
  );
}
