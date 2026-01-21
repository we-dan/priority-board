/**
 * Chat Components
 * Premium chat UI kit with typewriter effect
 *
 * Usage:
 *   import { ChatInput, MessageList, MessageBubble } from '@/components/chat';
 *
 *   function ChatPage() {
 *     const [messages, setMessages] = useState<Message[]>([]);
 *
 *     return (
 *       <div className="flex flex-col h-screen">
 *         <MessageList>
 *           {messages.map(msg => (
 *             <MessageBubble key={msg.id} message={msg} />
 *           ))}
 *         </MessageList>
 *         <ChatInput onSend={(text) => handleSend(text)} />
 *       </div>
 *     );
 *   }
 */

export { ChatInput } from './chat-input';
export { MessageList } from './message-list';
export { MessageBubble } from './message-bubble';
export { ToolCallBubble } from './tool-call';
export { ThinkingIndicator } from './thinking-indicator';
export { useTypewriter } from './use-typewriter';
export type { Message, ToolCall, ToolStatus, MessageRole, ChatState } from './types';
