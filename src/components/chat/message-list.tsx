import { useRef, useEffect, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MessageListProps {
  children: ReactNode;
  className?: string;
  autoScroll?: boolean;
}

/**
 * Scrollable message container with auto-scroll
 *
 * Features:
 * - Auto-scrolls to bottom on new messages
 * - Respects user scroll position (won't jump if scrolled up)
 * - Smooth scroll animation
 */
export function MessageList({
  children,
  className,
  autoScroll = true,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);

  // Track if user has scrolled up
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    isUserScrolledUp.current = !isAtBottom;
  };

  // Auto-scroll to bottom when children change
  useEffect(() => {
    if (!autoScroll || isUserScrolledUp.current) return;

    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [children, autoScroll]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'flex-1 overflow-y-auto scroll-smooth',
        'px-4 py-6 space-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}
