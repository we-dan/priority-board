import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { ColumnId } from '@/types/task';

interface AddTaskFormProps {
  columnId: ColumnId;
  onAddTask: (title: string, description: string, timeframe: string, columnId: ColumnId) => void;
}

export function AddTaskForm({ columnId, onAddTask }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim(), description.trim(), timeframe.trim(), columnId);
    setTitle('');
    setDescription('');
    setTimeframe('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setTimeframe('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors duration-150 group"
        data-column={columnId}
        aria-label={`Add task to ${columnId}`}
      >
        <Plus className="w-4 h-4 transition-transform duration-150 group-hover:scale-110" />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-card p-4 shadow-sm border border-border/50">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        autoFocus
        className="w-full px-0 py-1 mb-3 text-sm font-medium bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground/50"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-0 py-1 mb-3 text-xs bg-transparent border-none outline-none resize-none text-muted-foreground placeholder:text-muted-foreground/50"
      />

      <input
        type="text"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        placeholder="Timeframe (e.g., 2 hours, 3 days)"
        className="w-full px-2 py-1 mb-4 text-xs bg-muted/30 rounded border-none outline-none text-muted-foreground placeholder:text-muted-foreground/50"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-3 py-1.5 text-sm font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground transition-colors duration-150"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
