import { memo } from 'react';
import { Loader2, Check, AlertCircle, Terminal, FileText, Search, Globe } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ToolCall, ToolStatus } from './types';

interface ToolCallBubbleProps {
  toolCall: ToolCall;
  className?: string;
}

const statusIcons: Record<ToolStatus, typeof Loader2> = {
  pending: Loader2,
  running: Loader2,
  complete: Check,
  error: AlertCircle,
};

const toolIcons: Record<string, typeof Terminal> = {
  bash: Terminal,
  read: FileText,
  write: FileText,
  search: Search,
  web: Globe,
  default: Terminal,
};

/**
 * Tool call indicator with status
 *
 * Features:
 * - Animated spinner while running
 * - Success/error states
 * - Tool-specific icons
 */
export const ToolCallBubble = memo(function ToolCallBubble({
  toolCall,
  className,
}: ToolCallBubbleProps) {
  const StatusIcon = statusIcons[toolCall.status];
  const ToolIcon = toolIcons[toolCall.name.toLowerCase()] || toolIcons.default;
  const isActive = toolCall.status === 'pending' || toolCall.status === 'running';
  const isError = toolCall.status === 'error';

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5',
        'bg-muted/50 border text-xs',
        isError && 'border-destructive/50 bg-destructive/5',
        className
      )}
    >
      <ToolIcon className="h-3.5 w-3.5 text-muted-foreground" />

      <span className="font-medium capitalize">{toolCall.name}</span>

      {toolCall.description && (
        <span className="text-muted-foreground truncate max-w-[200px]">
          {toolCall.description}
        </span>
      )}

      <div className="ml-auto">
        <StatusIcon
          className={cn(
            'h-3.5 w-3.5',
            isActive && 'animate-spin text-primary',
            toolCall.status === 'complete' && 'text-green-500',
            isError && 'text-destructive'
          )}
        />
      </div>
    </div>
  );
});
