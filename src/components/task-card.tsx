import { Trash2 } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function TaskCard({ task, onDelete, onDragStart, onDragEnd }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className="group relative rounded-lg bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] active:shadow-sm cursor-grab active:cursor-grabbing border border-border/50"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-medium text-card-foreground leading-snug flex-1">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-destructive"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {task.timeframe && (
        <div className="flex items-center">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-medium">
            {task.timeframe}
          </span>
        </div>
      )}
    </div>
  );
}
