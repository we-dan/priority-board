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
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 active:bg-muted/50 active:scale-[0.98] transition-all duration-200 group"
        data-column={columnId}
        aria-label={`Lägg till uppgift i ${columnId}`}
      >
        <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-90" />
        <span>Lägg till uppgift</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-card p-4 shadow-sm border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Uppgiftstitel"
        autoFocus
        className="w-full px-0 py-1 mb-3 text-sm font-medium bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground/50 focus:placeholder:text-muted-foreground/70 transition-all duration-200"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beskrivning (valfritt)"
        rows={2}
        className="w-full px-0 py-1 mb-3 text-xs bg-transparent border-none outline-none resize-none text-muted-foreground placeholder:text-muted-foreground/50 focus:placeholder:text-muted-foreground/70 transition-all duration-200"
      />

      <input
        type="text"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        placeholder="Tidsram (t.ex. 2 timmar, 3 dagar)"
        className="w-full px-2 py-1 mb-4 text-xs bg-muted/30 rounded border border-transparent outline-none text-muted-foreground placeholder:text-muted-foreground/50 focus:bg-muted/50 focus:border-border/50 focus:placeholder:text-muted-foreground/70 transition-all duration-200"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-3 py-1.5 text-sm font-medium rounded bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 active:scale-[0.97] active:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:active:scale-100"
        >
          Lägg till
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 rounded hover:bg-muted/50 active:bg-muted/70 active:scale-95 text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Avbryt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
