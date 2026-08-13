'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Sidebar, { Conversation } from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
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

  // Active conversation title lookup
  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeTitle = activeConv?.title || 'New Chat';

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
      if (formatted.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const chatIdFromUrl = urlParams.get('chat');
        
        if (chatIdFromUrl && formatted.some(c => c.id === chatIdFromUrl)) {
          setActiveConversationId(chatIdFromUrl);
        } else if (!activeConversationId) {
          setActiveConversationId(formatted[0].id);
          window.history.replaceState(null, '', `/?chat=${formatted[0].id}`);
        }
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
  const handleNewChat = useCallback(async () => {
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
        window.history.pushState(null, '', `/?chat=${newConvData._id}`);
      }
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  }, []);

  // 4. Local delete conversation handler
  const handleDeleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      const newId = remaining.length > 0 ? remaining[0].id : '';
      setActiveConversationId(newId);
      if (newId) {
        window.history.replaceState(null, '', `/?chat=${newId}`);
      } else {
        window.history.replaceState(null, '', `/`);
      }
    }
  }, [activeConversationId, conversations]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    window.history.pushState(null, '', `/?chat=${id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  return (
    <div className="flex h-screen w-full bg-[#0d0e15] text-zinc-100 font-sans overflow-hidden selection:bg-purple-600 selection:text-white relative">
      {/* 1. SIDEBAR COMPONENT */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* 2. CHAT AREA & 3. ARTIFACT PANEL WRAPPER */}
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-[#0d0e15]">
        {/* Center: Chat Area */}
        <ChatArea
          conversationId={activeConversationId}
          conversationTitle={activeTitle}
        />

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
