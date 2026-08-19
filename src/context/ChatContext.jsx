import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!isLoggedIn) {
      setChats([]);
      setActiveChatId(null);
      return;
    }
    setLoadingChats(true);
    try {
      const { data } = await api.get('/chats');
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats);
        if (data.chats.length > 0 && !activeChatId) {
          setActiveChatId(data.chats[0].id || data.chats[0]._id);
        }
      }
    } catch (err) {
      console.error('Fetch chats error:', err);
    } finally {
      setLoadingChats(false);
    }
  }, [isLoggedIn, activeChatId]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchChats();
    }
  }, [isLoggedIn, fetchChats]);

  const activeChat = chats.find(c => c.id === activeChatId || c._id === activeChatId) || chats[0] || null;

  const sendMessage = async (chatId, text) => {
    if (!text.trim() || !chatId) return;

    try {
      const { data } = await api.post(`/chats/${chatId}/messages`, { text: text.trim() });
      if (data.success && data.chat) {
        setChats(prev => prev.map(c => (c.id === chatId || c._id === chatId) ? data.chat : c));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر إرسال الرسالة';
      return { success: false, message };
    }
  };

  const startChatWithUser = async (userName, userAvatar, peerId) => {
    if (!isLoggedIn) return { success: false, message: 'يرجى تسجيل الدخول أولاً' };

    try {
      const payload = peerId ? { peerId } : { peerName: userName };
      const { data } = await api.post('/chats/start', payload);

      if (data.success && data.chat) {
        const newChat = data.chat;
        const chatId = newChat.id || newChat._id;
        
        setChats(prev => {
          const exists = prev.find(c => c.id === chatId || c._id === chatId);
          if (exists) {
            return prev.map(c => (c.id === chatId || c._id === chatId) ? newChat : c);
          }
          return [newChat, ...prev];
        });

        setActiveChatId(chatId);
        return { success: true, chat: newChat };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر بدء المحادثة مع هذا المستخدم';
      return { success: false, message };
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        activeChat,
        loadingChats,
        fetchChats,
        sendMessage,
        startChatWithUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
