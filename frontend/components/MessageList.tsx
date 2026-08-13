'use client';

import React, { useEffect, useRef } from 'react';
import { AgentType, AGENT_OPTIONS } from './ChatInput';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentType?: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  msg: ChatMessage;
}

const MessageBubble = React.memo(({ msg }: MessageBubbleProps) => {
  const isUser = msg.role === 'user';
  const agentMeta = AGENT_OPTIONS.find((a) => a.id === msg.agentType) || AGENT_OPTIONS[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-purple-600/20 mt-1">
          T
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white rounded-tr-none shadow-md shadow-purple-950/40 border border-purple-400/20'
            : 'bg-[#161724] border border-zinc-800 text-zinc-200 rounded-tl-none shadow-lg shadow-black/20'
        }`}
      >
        {/* Assistant Agent Header Tag */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs">{agentMeta.icon}</span>
              <span className="text-xs font-bold text-indigo-400">
                {agentMeta.name}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(msg.content)}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition-opacity p-1 rounded hover:bg-zinc-800 text-[11px] flex items-center gap-1 cursor-pointer"
              title="Copy message"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
        )}

        {/* Message Content */}
        <div className="whitespace-pre-wrap break-words font-sans text-xs sm:text-sm">
          {msg.content}
        </div>

        {/* Message Footer / Timestamp */}
        {msg.createdAt && (
          <div
            className={`text-[10px] mt-2 font-normal ${
              isUser ? 'text-purple-200 text-right' : 'text-zinc-500'
            }`}
          >
            {msg.createdAt}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  onSelectPrompt?: (prompt: string, agent: AgentType) => void;
}

const SAMPLE_PROMPTS: { title: string; prompt: string; agent: AgentType; icon: string }[] = [
  {
    title: 'Code Generation',
    prompt: 'Write a TypeScript function for debouncing API calls in React',
    agent: 'coding',
    icon: '⚡',
  },
  {
    title: 'Web Research',
    prompt: 'What are the latest updates in multi-agent LLM systems?',
    agent: 'search',
    icon: '🔍',
  },
  {
    title: 'PDF Document',
    prompt: 'Generate an executive summary document layout for a project proposal',
    agent: 'pdf',
    icon: '📄',
  },
  {
    title: 'Presentation Deck',
    prompt: 'Create a 5-slide pitch deck structure for an AI startup',
    agent: 'ppt',
    icon: '📊',
  },
];

const MessageList: React.FC<MessageListProps> = ({
  messages = [],
  loading = false,
  onSelectPrompt,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
      {messages.length === 0 ? (
        /* EMPTY STATE WELCOME SCREEN */
        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 py-12">
          {/* Main Logo & Headline */}
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-purple-600/30 mx-auto animate-bounce-subtle">
              T
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What can <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">TavexAI</span> build for you today?
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Select an agent mode or start typing below to generate code, research topics, create presentations, or build documents.
            </p>
          </div>

          {/* Quick Prompt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {SAMPLE_PROMPTS.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelectPrompt?.(item.prompt, item.agent)}
                className="p-4 rounded-2xl bg-[#151623] hover:bg-[#1c1d2e] border border-zinc-800/80 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-2 active:scale-[0.98] shadow-sm hover:shadow-indigo-500/10"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl p-1.5 rounded-xl bg-zinc-800/80 group-hover:bg-indigo-600/20 text-white transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-medium group-hover:text-white line-clamp-2 leading-relaxed">
                  "{item.prompt}"
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* MESSAGE LIST ITEMS */
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* TYPING / LOADING INDICATOR */}
          {loading && (
            <div className="flex gap-3 sm:gap-4 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-purple-600/20 mt-1">
                T
              </div>
              <div className="bg-[#161724] border border-zinc-800 rounded-2xl rounded-tl-none p-4 shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-zinc-400 font-medium ml-2">TavexAI agent is thinking...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageList);
