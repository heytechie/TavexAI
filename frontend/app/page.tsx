'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Sidebar, { Conversation } from '@/components/Sidebar';
import api from '@/utils/axios';

export default function Home() {
  const {
    user,
    sidebarOpen,
    showLogoutModal,
    fetchCurrentUser,
    logout,
    setSidebarOpen,
    setShowLogoutModal
  } = useAuthStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [loadingChats, setLoadingChats] = useState<boolean>(false);

  // 1. Fetch current user session on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // 2. Fetch conversations from backend whenever user logs in
  const fetchConversations = async () => {
    setLoadingChats(true);
    try {
      const res = await api.get('/chat/get-conversations');
      const list = res.data?.data || [];
      const formatted: Conversation[] = list.map((item: any) => ({
        id: item._id,
        title: item.title || 'New Chat',
        updatedAt: item.updatedAt
          ? new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
      }));
      setConversations(formatted);
      if (formatted.length > 0 && !activeConversationId) {
        setActiveConversationId(formatted[0].id);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
      setActiveConversationId('');
    }
  }, [user]);

  // 3. Create a new conversation via backend API call
  const handleNewChat = async () => {
    try {
      const res = await api.post('/chat/create-conversation');
      const newConvData = res.data?.data;
      if (newConvData && newConvData._id) {
        const newConv: Conversation = {
          id: newConvData._id,
          title: newConvData.title || 'New Chat',
          updatedAt: 'Just now',
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConvData._id);
      }
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  };

  // 4. Local delete conversation handler
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0e15] text-zinc-100 font-sans overflow-hidden selection:bg-purple-600 selection:text-white relative">
      {/* 1. SIDEBAR COMPONENT */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* 2. CHAT AREA & 3. ARTIFACT PANEL WRAPPER */}
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-[#0d0e15]">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors z-30 cursor-pointer"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Center: Chat Area placeholder */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 border-r border-zinc-800/60 text-zinc-500">
          <div className="max-w-md text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
              💬
            </div>
            <h2 className="text-lg font-bold text-white">Chat Area</h2>
            <p className="text-xs text-zinc-400">
              Selected Conversation ID: <span className="text-purple-400 font-mono">{activeConversationId || 'None'}</span>
            </p>
          </div>
        </div>

        {/* Right: Artifact Panel placeholder */}
        <div className="w-80 h-full hidden lg:flex flex-col items-center justify-center p-6 bg-[#0f1019] border-l border-zinc-800/60 text-zinc-500">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-lg font-bold">
              ⚡
            </div>
            <h3 className="text-sm font-semibold text-white">Artifact Panel</h3>
            <p className="text-xs text-zinc-500">Code / document preview pane</p>
          </div>
        </div>
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-[#161722] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to log out of TavexAI?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
