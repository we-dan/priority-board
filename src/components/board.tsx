import { useState } from 'react';
import { Column } from './column';
import { ThemeToggle } from './theme-toggle';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { COLUMNS } from '@/types/task';
import type { Task, ColumnId } from '@/types/task';

export function Board() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('priority-board-tasks', []);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const addTask = (title: string, description: string, timeframe: string, columnId: ColumnId) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      timeframe,
      columnId,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: ColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    // Only update if the column changed
    if (draggedTask.columnId !== targetColumnId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggedTask.id ? { ...task, columnId: targetColumnId } : task
        )
      );
    }

    setDraggedTask(null);
  };

  const getTasksByColumn = (columnId: ColumnId) => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Prioriteringstavla
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organisera uppgifter efter prioritet och tid
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
