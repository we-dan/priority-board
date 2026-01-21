import { memo, useMemo } from 'react';
import { User, Bot } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTypewriter } from './use-typewriter';
import { ToolCallBubble } from './tool-call';
import type { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  /** Enable typewriter effect for assistant messages */
  typewriter?: boolean;
  /** Characters per second for typewriter (default: 40) */
  typewriterSpeed?: number;
  className?: string;
}

/**
 * Premium message bubble with typewriter effect
 *
 * Features:
 * - Distinct styling for user vs assistant
 * - Typewriter animation for AI responses
 * - Tool call rendering
 * - Click to skip typewriter
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  typewriter = true,
  typewriterSpeed = 40,
  className,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const showTypewriter = !isUser && typewriter && message.isStreaming !== false;

  const { displayedText, isTyping, skipToEnd } = useTypewriter(
    showTypewriter ? message.content : '',
    { speed: typewriterSpeed, autoStart: showTypewriter }
  );

  const content = showTypewriter ? displayedText : message.content;

  // Format timestamp
  const time = useMemo(() => {
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.timestamp]);

  return (
    <div
      className={cn(
        'flex gap-3 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <div
          onClick={isTyping ? skipToEnd : undefined}
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted rounded-bl-md',
            isTyping && 'cursor-pointer'
          )}
        >
          {content}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse rounded-sm" />
          )}
        </div>

        {/* Tool calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            {message.toolCalls.map((tool) => (
              <ToolCallBubble key={tool.id} toolCall={tool} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span
          className={cn(
            'text-[10px] text-muted-foreground px-1',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {time}
        </span>
      </div>
    </div>
  );
});
