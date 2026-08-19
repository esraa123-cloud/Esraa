import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, MessageSquare, User, Circle } from 'lucide-react';

export const MessagesPage = () => {
  const { chats, activeChatId, setActiveChatId, activeChat, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeChatId, inputText);
    setInputText('');
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <span>المحادثات المباشرة</span>
            <MessageSquare size={20} />
          </div>
          <div className="chat-list">
            {chats.map(chat => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  className={`chat-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className="avatar">{chat.peerAvatar || 'ع'}</div>
                  <div className="chat-info">
                    <div className="name">
                      <span>{chat.peerName}</span>
                      <span className="time">{lastMsg?.time || ''}</span>
                    </div>
                    <div className="preview">
                      {lastMsg ? (lastMsg.sender === 'me' ? 'أنت: ' : '') + lastMsg.text : 'بدء محادثة جديدة...'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-main-header">
                <div className="avatar">{activeChat.peerAvatar || 'ع'}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{activeChat.peerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Circle size={8} fill="var(--teal)" />
                    <span>نشط الآن</span>
                  </div>
                </div>
              </div>

              <div className="chat-body">
                {activeChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`msg-bubble ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}
                  >
                    <div>{msg.text}</div>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="chat-footer">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="اكتب رسالتك هنا..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="btn-send">
                  <Send size={18} />
                  <span>إرسال</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
              اختر محادثة من القائمة للبدء
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
