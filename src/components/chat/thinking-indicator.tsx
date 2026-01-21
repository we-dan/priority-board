import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  className?: string;
}

/**
 * Animated thinking indicator
 * Shows while AI is processing
 */
export function ThinkingIndicator({ className }: ThinkingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1 px-4 py-2', className)}>
      <span className="text-sm text-muted-foreground">Thinking</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
