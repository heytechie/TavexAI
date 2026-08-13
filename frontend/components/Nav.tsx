'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface NavProps {
  title?: string;
  selectedAgent?: string;
  onClearChat?: () => void;
}

const AGENT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  auto: { label: 'Auto Router', icon: '🤖', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  chat: { label: 'General Chat', icon: '💬', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  search: { label: 'Web Search', icon: '🔍', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  coding: { label: 'Code Assistant', icon: '⚡', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  pdf: { label: 'PDF Generator', icon: '📄', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  ppt: { label: 'PPT Builder', icon: '📊', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  image: { label: 'Image Gen', icon: '🎨', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
};

const Nav: React.FC<NavProps> = ({
  title = 'New Chat',
  selectedAgent = 'auto',
  onClearChat,
}) => {
  const { sidebarOpen, setSidebarOpen } = useAuthStore();
  const agentInfo = AGENT_LABELS[selectedAgent] || AGENT_LABELS.auto;

  return (
    <header className="h-14 sm:h-16 w-full bg-[#12131c]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 z-10 select-none">
      {/* LEFT SECTION: Sidebar Toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 transition-all cursor-pointer shrink-0 active:scale-95"
            title="Open Sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold shrink-0">
            💬
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {title}
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Active" />
            </div>
            <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
              TavexAI Multi-Agent Session
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Selected Agent Info & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active Agent Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${agentInfo.color} transition-all`}
          title={`Active mode: ${agentInfo.label}`}
        >
          <span className="text-xs">{agentInfo.icon}</span>
          <span>{agentInfo.label}</span>
        </div>

        {/* Clear Chat Action Button */}
        {onClearChat && (
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all cursor-pointer"
            title="Clear Chat Messages"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}

        {/* Status Indicator Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span className="hidden md:inline">Gemini 3.6</span>
          <span className="md:hidden">Ready</span>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Nav);
