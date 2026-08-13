'use client';

import React, { useState, useRef, useEffect } from 'react';

export type AgentType = 'auto' | 'chat' | 'search' | 'coding' | 'pdf' | 'ppt' | 'image';

export interface AgentOption {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
}

export const AGENT_OPTIONS: AgentOption[] = [
  {
    id: 'auto',
    name: 'Auto Detect',
    description: 'Automatically chooses the best agent for your prompt',
    icon: '🤖',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'chat',
    name: 'General Chat',
    description: 'Conversational assistant for questions and advice',
    icon: '💬',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    id: 'search',
    name: 'Web Search',
    description: 'Live web searches for up-to-date events & research',
    icon: '🔍',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'coding',
    name: 'Code Assistant',
    description: 'Code generation, refactoring & debugging',
    icon: '⚡',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'pdf',
    name: 'PDF Generator',
    description: 'Creates downloadable structured PDF documents',
    icon: '📄',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-500/10',
  },
  {
    id: 'ppt',
    name: 'PPT Builder',
    description: 'Builds PowerPoint presentation slide decks',
    icon: '📊',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
  {
    id: 'image',
    name: 'Image Generator',
    description: 'Generates visual artwork and graphics',
    icon: '🎨',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
];

interface ChatInputProps {
  onSendMessage: (content: string, agent: AgentType) => void;
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
  loading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  selectedAgent,
  onSelectAgent,
  loading = false,
  placeholder = 'Ask TavexAI anything or type a prompt...',
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() || loading) return;
    onSendMessage(content.trim(), selectedAgent);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2 relative z-20">
      <div className="bg-[#161722]/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-3 shadow-2xl shadow-black/40 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
        
        {/* TOP ROW: Horizontal Agent Options */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800/60 relative">
          
          {/* Horizontal scrollable agents */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 pb-1 pr-2">
            {AGENT_OPTIONS.map((agent) => {
              const isSelected = agent.id === selectedAgent;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelectAgent(agent.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium sm:font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? agent.badgeColor
                      : 'text-zinc-400 bg-zinc-800/30 hover:bg-zinc-800/70 hover:text-zinc-200 border border-transparent'
                  }`}
                  title={agent.description}
                >
                  <span className="text-sm">{agent.icon}</span>
                  <span className={isSelected ? 'inline' : 'hidden md:inline'}>{agent.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Tip / Keyboard shortcut indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-500 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 font-mono text-[10px]">
              Shift + Enter
            </span>
            <span>for new line</span>
          </div>
        </div>

        {/* MIDDLE ROW: Textarea input */}
        <div className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            className="w-full bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none resize-none min-h-[42px] max-h-[160px] py-2 px-1 scrollbar-thin scrollbar-thumb-zinc-700"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!content.trim() || loading}
            className={`p-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              content.trim() && !loading
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/25 active:scale-95'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-60'
            }`}
            title="Send Message"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatInput);
