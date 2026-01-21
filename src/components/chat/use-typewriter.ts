import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  /** Characters per second (default: 40) */
  speed?: number;
  /** Start typing immediately (default: true) */
  autoStart?: boolean;
  /** Callback when typing completes */
  onComplete?: () => void;
}

/**
 * Typewriter effect hook for AI message streaming feel
 * Creates a premium, fluid typing animation
 */
export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
) {
  const { speed = 40, autoStart = true, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  // Use number type for browser setInterval (Vite bundles for browser)
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when text changes
    indexRef.current = 0;
    setDisplayedText('');

    if (!text || !autoStart) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const msPerChar = 1000 / speed;

    intervalRef.current = window.setInterval(() => {
      if (indexRef.current < text.length) {
        // Add characters in small chunks for smoother feel
        const charsToAdd = Math.min(2, text.length - indexRef.current);
        indexRef.current += charsToAdd;
        setDisplayedText(text.slice(0, indexRef.current));
      } else {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
        }
        setIsTyping(false);
        onComplete?.();
      }
    }, msPerChar);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, autoStart, onComplete]);

  const skipToEnd = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    setDisplayedText(text);
    setIsTyping(false);
    onComplete?.();
  };

  return { displayedText, isTyping, skipToEnd };
}
