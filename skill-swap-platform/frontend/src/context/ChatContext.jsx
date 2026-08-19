import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { fetchChatsRequest, startChatRequest, sendMessageRequest } from '../api/chatAPI';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const loadChats = useCallback(async () => {
    if (!isAuthenticated) {
      setChats([]);
      setActiveChatId(null);
      return;
    }
    try {
      const res = await fetchChatsRequest();
      setChats(res.data.chats);
      if (!activeChatId && res.data.chats.length > 0) {
        setActiveChatId(res.data.chats[0].id);
      }
    } catch (err) {
      console.error('فشل تحميل المحادثات:', err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId || c._id === activeChatId) || null,
    [chats, activeChatId]
  );

  const sendMessage = async (chatId, text) => {
    try {
      const res = await sendMessageRequest(chatId, text);
      setChats((prev) => prev.map((c) => (c.id === chatId || c._id === chatId ? res.data.chat : c)));
      return { success: true };
    } catch (err) {
      console.error('فشل إرسال الرسالة:', err.message);
      return { success: false, message: err.message };
    }
  };

  const startChatWithUser = async (peerName) => {
    try {
      const res = await startChatRequest(peerName);
      setChats((prev) => {
        const exists = prev.some((c) => c.id === res.data.chat.id);
        return exists ? prev.map((c) => (c.id === res.data.chat.id ? res.data.chat : c)) : [res.data.chat, ...prev];
      });
      setActiveChatId(res.data.chat.id);
      return { success: true };
    } catch (err) {
      console.error('فشل بدء المحادثة:', err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <ChatContext.Provider
      value={{ chats, activeChatId, setActiveChatId, activeChat, sendMessage, startChatWithUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};
