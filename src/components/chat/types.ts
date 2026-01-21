/**
 * Chat Types
 * Core interfaces for the chat system
 */

export type MessageRole = 'user' | 'assistant';

export type ToolStatus = 'pending' | 'running' | 'complete' | 'error';

export interface ToolCall {
  id: string;
  name: string;
  description?: string;
  status: ToolStatus;
  result?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
}

export interface ChatState {
  messages: Message[];
  isGenerating: boolean;
}
