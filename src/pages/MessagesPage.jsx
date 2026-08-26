import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Circle, ArrowRight } from 'lucide-react';

export const MessagesPage = () => {
  const { chats, activeChatId, setActiveChatId, activeChat, sendMessage, loadingChats } = useChat();
  const { isLoggedIn } = useAuth();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll chat window to bottom on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeChat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText || !inputText.trim() || !activeChatId || sending) return;

    const textToSend = inputText.trim();
    setInputText(''); // Clear input immediately
    setSending(true);

    await sendMessage(activeChatId, textToSend);
    setSending(false);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileShowChat(true);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--muted)', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
        <h2>يرجى تسجيل الدخول للوصول إلى المحادثات والرسائل المباشرة</h2>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className={`chat-container ${mobileShowChat ? 'mobile-show-main' : 'mobile-show-sidebar'}`}>
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <span>المحادثات المباشرة</span>
            <MessageSquare size={20} />
          </div>
          {loadingChats ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
              جاري تحميل المحادثات... ⏳
            </div>
          ) : (
            <div className="chat-list">
              {chats.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                  لا توجد محادثات نشطة بعد. يمكنك بدء محادثة مع أي عضو من صفحة المهارات.
                </div>
              ) : (
                chats.map(chat => {
                  const chatId = chat.id || chat._id;
                  const lastMsg = chat.messages && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1]
                    : null;
                  const isActive = chatId === activeChatId;

                  return (
                    <div
                      key={chatId}
                      className={`chat-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectChat(chatId)}
                    >
                      <div className="avatar">{chat.peerAvatar || (chat.peerName ? chat.peerName.charAt(0) : 'إ')}</div>
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
                })
              )}
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-main-header">
                <button
                  className="mobile-back-btn"
                  onClick={() => setMobileShowChat(false)}
                  title="العودة للقائمة"
                >
                  <ArrowRight size={20} />
                </button>
                <div className="avatar">{activeChat.peerAvatar || (activeChat.peerName ? activeChat.peerName.charAt(0) : 'إ')}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{activeChat.peerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Circle size={8} fill="var(--teal)" />
                    <span>نشط الآن</span>
                  </div>
                </div>
              </div>

              <div className="chat-body" ref={chatBodyRef}>
                {(activeChat.messages || []).map((msg, index) => (
                  <div
                    key={msg.id || msg._id || index}
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
                <button type="submit" className="btn-send" disabled={!inputText.trim()}>
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
