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
      className="group relative rounded-lg bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:shadow-sm active:translate-y-0 cursor-grab active:cursor-grabbing border border-border/50 hover:border-border"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-medium text-card-foreground leading-snug flex-1">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-destructive/10 hover:scale-110 active:scale-95 text-muted-foreground hover:text-destructive"
          aria-label="Ta bort uppgift"
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
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-medium transition-colors duration-200 group-hover:bg-muted/70">
            {task.timeframe}
          </span>
        </div>
      )}
    </div>
  );
}
