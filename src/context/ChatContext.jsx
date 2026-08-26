import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_CHATS } from '../data/initialData';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isLoggedIn, currentUser } = useAuth();

  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('mahara_chats_v6');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved chats:', e);
    }
    return INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return chats.length > 0 ? (chats[0].id || chats[0]._id) : null;
  });

  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    localStorage.setItem('mahara_chats_v6', JSON.stringify(chats));
  }, [chats]);

  const fetchChats = useCallback(async () => {
    // Client-side sync
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId || c._id === activeChatId) || chats[0] || null;

  const sendMessage = async (chatId, text) => {
    if (!text || !text.trim() || !chatId) return { success: false, message: 'رسالة فارغة' };

    const textToSend = text.trim();
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sender: 'me',
      text: textToSend,
      time: nowTime
    };

    setChats(prevChats =>
      prevChats.map(c => {
        if (c.id === chatId || c._id === chatId) {
          return {
            ...c,
            active: true,
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      })
    );

    // Simulate friendly auto-reply after 1.5s to make chat feel live & dynamic
    setTimeout(() => {
      const autoReplies = [
        'أهلاً بك! وصلت رسالتك ويسعدني جداً التبادل معك 🌸',
        'مرحباً! أنسق الموعد معكِ حالاً للبدء في جلسة التبادل ✨',
        'شكراً لرسالتك! متوفرة اليوم للتبادل المعرفي 💻'
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMsg = {
        id: 'm_reply_' + Date.now(),
        sender: 'peer',
        text: randomReply,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chatId || c._id === chatId) {
            return {
              ...c,
              messages: [...(c.messages || []), replyMsg]
            };
          }
          return c;
        })
      );
    }, 1500);

    return { success: true };
  };

  const startChatWithUser = async (userName, userAvatar, peerId) => {
    const existing = chats.find(c => c.peerName === userName || c.peerId === peerId);
    if (existing) {
      const id = existing.id || existing._id;
      setActiveChatId(id);
      return { success: true, chat: existing };
    }

    const newChat = {
      id: 'c_' + Date.now(),
      _id: 'c_' + Date.now(),
      peerId: peerId || 'u_' + Date.now(),
      peerName: userName || 'مستخدم',
      peerAvatar: userAvatar || (userName ? userName.charAt(0) : 'إ'),
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return { success: true, chat: newChat };
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
