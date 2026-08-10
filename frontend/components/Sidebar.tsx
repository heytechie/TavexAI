'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export interface Conversation {
  id: string;
  title: string;
  updatedAt?: string;
  isPinned?: boolean;
}

interface SidebarProps {
  conversations?: Conversation[];
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteConversation?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations = [],
  activeConversationId = '',
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}) => {
  const {
    user,
    loading,
    sidebarOpen,
    toggleSidebar,
    loginWithGoogle,
    setShowLogoutModal,
  } = useAuthStore();

  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 sm:w-72 h-full bg-[#12131c] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 relative overflow-hidden z-20 text-zinc-200 select-none">
      {/* 1. TOP HEADER: App Name & Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-purple-600/20">
            T
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                TavexAI
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                v1.0
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title="Close sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 2. NEW CHAT BUTTON */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onNewChat}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-white font-semibold text-xs shadow-sm hover:shadow-indigo-500/10 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/80 group-hover:bg-indigo-500 flex items-center justify-center text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="tracking-wide">New Chat</span>
          </div>
          <span className="text-[10px] text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/50">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* 3. CHAT CONVERSATIONS LIST */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Recent Conversations
        </div>

        {conversations.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800/60 border border-zinc-700/50 mx-auto flex items-center justify-center text-zinc-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-400 font-medium">No chat history yet</p>
            <p className="text-[11px] text-zinc-500">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((item) => {
            const isActive = item.id === activeConversationId;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredChatId(item.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                onClick={() => onSelectConversation?.(item.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <svg
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="truncate">{item.title}</span>
                </div>

                {/* Right actions or time tag */}
                <div className="flex items-center gap-1 shrink-0">
                  {hoveredChatId === item.id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation?.(item.id);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-700/50 transition-colors"
                      title="Delete chat"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  ) : item.updatedAt ? (
                    <span className="text-[10px] text-zinc-500 font-normal">
                      {item.updatedAt}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. FOOTER: ACCOUNT DETAILS */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#0e0f17]">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-transparent transition-colors">
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <div className="shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-700/60"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-white truncate leading-snug">
                  {user.name || user.email?.split('@')[0] || 'User Account'}
                </span>
                <span className="text-xs text-zinc-500 font-medium leading-none mt-0.5">
                  Free Plan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {/* Token / Coin Icon */}
              <button
                className="text-amber-500/90 hover:text-amber-400 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Tokens"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Sign Out / Exit Icon */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue With Google</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;