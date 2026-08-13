'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Nav from './Nav';
import MessageList, { ChatMessage } from './MessageList';
import ChatInput, { AgentType } from './ChatInput';
import api from '@/utils/axios';

interface ChatAreaProps {
  conversationId?: string;
  conversationTitle?: string;
  onTitleUpdate?: (newTitle: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversationId = '',
  conversationTitle = 'New Chat',
  onTitleUpdate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('auto');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch messages from backend whenever active conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/get-messages/${conversationId}`);
        const list = res.data?.data || [];
        const formatted: ChatMessage[] = list.map((msg: any) => ({
          id: msg._id || String(Math.random()),
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          agentType: msg.agentType || 'chat',
          createdAt: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Handle sending message
  const handleSendMessage = useCallback(async (content: string, agent: AgentType) => {
    if (!content.trim() || loading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content,
      agentType: agent,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Optimistic update for UI
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Save user message to backend chat service if conversation exists
      if (conversationId) {
        await api.post('/chat/save-message', {
          conversationId,
          role: 'user',
          content,
        });
      }

      // 3. Simulated/Actual Agent Response (Integration point for multi-agent service)
      // In production/full backend connection, this calls agent graph router.
      let replyContent = '';
      if (agent === 'coding') {
        replyContent = `Here is a solution tailored for your request:\n\n\`\`\`typescript\n// ${content.slice(0, 40)}...\nfunction solution() {\n  console.log("Executing ${agent} agent task");\n  return true;\n}\n\`\`\`\nLet me know if you need further adjustments or explanations!`;
      } else if (agent === 'search') {
        replyContent = `🔍 **Web Search Results for:** "${content}"\n\n- Gathered real-time information from top sources.\n- Synthesized key insights based on current query context.`;
      } else if (agent === 'pdf') {
        replyContent = `📄 **PDF Document Ready**\n\nGenerated structured PDF layout for: "${content}". You can preview or download the generated document artifact.`;
      } else if (agent === 'ppt') {
        replyContent = `📊 **Presentation Slide Deck Generated**\n\nOutline created with 5 structured slides addressing: "${content}".`;
      } else if (agent === 'image') {
        replyContent = `🎨 **Image Generation Result**\n\nGenerated custom visual asset based on prompt: "${content}".`;
      } else {
        replyContent = `I am processing your prompt: "${content}". As your TavexAI Assistant, I am ready to help you build, research, or refine your workflow.`;
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        agentType: agent,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 4. Save assistant response to backend
      if (conversationId) {
        await api.post('/chat/save-message', {
          conversationId,
          role: 'assistant',
          content: replyContent,
        });
      }

      // Update state with assistant response
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, loading]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSelectPrompt = useCallback((prompt: string, agent: AgentType) => {
    setSelectedAgent(agent);
    handleSendMessage(prompt, agent);
  }, [handleSendMessage]);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0d0e15] overflow-hidden relative">
      {/* 1. TOP NAVBAR */}
      <Nav
        title={conversationTitle}
        selectedAgent={selectedAgent}
        onClearChat={messages.length > 0 ? handleClearChat : undefined}
      />

      {/* 2. MESSAGE LIST AREA */}
      <MessageList
        messages={messages}
        loading={loading}
        onSelectPrompt={handleSelectPrompt}
      />

      {/* 3. CHAT INPUT AREA WITH AGENT SELECTION */}
      <ChatInput
        onSendMessage={handleSendMessage}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        loading={loading}
      />
    </div>
  );
};

export default React.memo(ChatArea);
