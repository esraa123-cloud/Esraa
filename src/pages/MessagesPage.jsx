import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, ArrowRight } from 'lucide-react';

export const MessagesPage = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    sendMessage,
    loadingChats,
  } = useChat();

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
        behavior: 'smooth',
      });
    }
  }, [activeChat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || !activeChatId || sending) return;

    const textToSend = inputText.trim();

    setInputText('');
    setSending(true);

    try {
      await sendMessage(activeChatId, textToSend);
    } finally {
      setSending(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileShowChat(true);
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          paddingTop: '120px',
          textAlign: 'center',
          color: 'var(--muted)',
          minHeight: '60vh',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}
        >
          💬
        </div>

        <h2>
          يرجى تسجيل الدخول للوصول إلى المحادثات والرسائل المباشرة
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: '64px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className={`chat-container ${
          mobileShowChat
            ? 'mobile-show-main'
            : 'mobile-show-sidebar'
        }`}
      >
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <span>المحادثات المباشرة</span>
            <MessageSquare size={20} />
          </div>

          {loadingChats ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '0.85rem',
              }}
            >
              جاري تحميل المحادثات... ⏳
            </div>
          ) : (
            <div className="chat-list">
              {chats.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  لا توجد محادثات نشطة بعد. يمكنك بدء محادثة مع أي عضو
                  من صفحة المهارات.
                </div>
              ) : (
                chats.map((chat) => {
                  const chatId = chat.id || chat._id;

                  const lastMsg =
                    chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1]
                      : null;

                  const isActive = chatId === activeChatId;

                  return (
                    <div
                      key={chatId}
                      className={`chat-item ${
                        isActive ? 'active' : ''
                      }`}
                      onClick={() => handleSelectChat(chatId)}
                    >
                      <div className="avatar">
                        {chat.peerAvatar ||
                          (chat.peerName
                            ? chat.peerName.charAt(0)
                            : 'إ')}
                      </div>

                      <div className="chat-info">
                        <div className="name">
                          <span>{chat.peerName}</span>

                          <span className="time">
                            {lastMsg?.time || ''}
                          </span>
                        </div>

                        <div className="preview">
                          {lastMsg
                            ? (lastMsg.sender === 'me'
                                ? 'أنت: '
                                : '') + lastMsg.text
                            : 'بدء محادثة جديدة...'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Main Chat Panel */}
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-header">
                <button
                  type="button"
                  className="mobile-back-btn"
                  onClick={() => setMobileShowChat(false)}
                  title="العودة للمحادثات"
                >
                  <ArrowRight size={20} />
                </button>

                <div className="avatar">
                  {activeChat.peerAvatar ||
                    (activeChat.peerName
                      ? activeChat.peerName.charAt(0)
                      : 'إ')}
                </div>

                <div className="user-details">
                  <h3>{activeChat.peerName}</h3>
                  <span>متصل الآن 🟢</span>
                </div>
              </div>

              <div className="chat-body" ref={chatBodyRef}>
                {activeChat.messages &&
                activeChat.messages.length > 0 ? (
                  activeChat.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`msg-bubble ${
                        msg.sender === 'me'
                          ? 'sent'
                          : 'received'
                      }`}
                    >
                      {msg.text}

                      <span className="msg-time">
                        {msg.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      margin: 'auto',
                      color: 'var(--muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    لا توجد رسائل سابقة. ابدأ المحادثة الآن! 👋
                  </div>
                )}
              </div>

              <form
                className="chat-footer"
                onSubmit={handleSend}
              >
                <input
                  type="text"
                  placeholder="اكتب رسالتك هنا..."
                  value={inputText}
                  onChange={(e) =>
                    setInputText(e.target.value)
                  }
                  disabled={sending}
                />

                <button
                  type="submit"
                  className="btn-send"
                  disabled={
                    sending || !inputText.trim()
                  }
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                margin: 'auto',
                textAlign: 'center',
                color: 'var(--muted)',
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                }}
              >
                💬
              </div>

              <h3>اختر محادثة لبدء المراسلة</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};