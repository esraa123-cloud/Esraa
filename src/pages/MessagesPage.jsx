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
      <div className="messages-page messages-page--locked">
        <div className="chat-empty-state chat-empty-state--page">
          <div className="chat-empty-icon">
            <MessageSquare size={28} />
          </div>
          <h2>يرجى تسجيل الدخول للوصول إلى المحادثات</h2>
          <p>سجّل دخولك لبدء المراسلة المباشرة مع الأعضاء.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
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
            <span>المحادثات</span>
            <MessageSquare size={18} />
          </div>

          {loadingChats ? (
            <div className="chat-empty-state chat-empty-state--sidebar">
              <div className="chat-loading-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>جاري تحميل المحادثات...</p>
            </div>
          ) : (
            <div className="chat-list">
              {chats.length === 0 ? (
                <div className="chat-empty-state chat-empty-state--sidebar">
                  <div className="chat-empty-icon">
                    <MessageSquare size={22} />
                  </div>
                  <p>لا توجد محادثات بعد</p>
                  <span>ابدأ محادثة مع أي عضو من صفحة المهارات.</span>
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
                      <div className="chat-avatar">
                        {chat.peerAvatar ||
                          (chat.peerName
                            ? chat.peerName.charAt(0)
                            : 'إ')}
                      </div>

                      <div className="chat-info">
                        <div className="name">
                          <span className="chat-peer-name">
                            {chat.peerName}
                          </span>

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

                <div className="chat-avatar">
                  {activeChat.peerAvatar ||
                    (activeChat.peerName
                      ? activeChat.peerName.charAt(0)
                      : 'إ')}
                </div>

                <div className="chat-user-details">
                  <h3>{activeChat.peerName}</h3>
                  <span className="chat-status">
                    <span className="chat-status-dot" />
                    متصل الآن
                  </span>
                </div>
              </div>

              <div className="chat-body" ref={chatBodyRef}>
                {activeChat.messages &&
                activeChat.messages.length > 0 ? (
                  activeChat.messages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`msg-bubble ${
                        msg.sender === 'me'
                          ? 'sent'
                          : 'received'
                      }`}
                    >
                      <p className="msg-text">{msg.text}</p>
                      <span className="msg-time">
                        {msg.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="chat-empty-state chat-empty-state--body">
                    <div className="chat-empty-icon">
                      <MessageSquare size={22} />
                    </div>
                    <p>لا توجد رسائل بعد</p>
                    <span>اكتب رسالة للبدء في المحادثة.</span>
                  </div>
                )}
              </div>

              <form
                className="chat-footer"
                onSubmit={handleSend}
              >
                <input
                  type="text"
                  className="chat-input"
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
                  aria-label="إرسال"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state chat-empty-state--main">
              <div className="chat-empty-icon">
                <MessageSquare size={28} />
              </div>
              <h3>اختر محادثة لبدء المراسلة</h3>
              <p>حدد محادثة من القائمة أو ابدأ واحدة جديدة من صفحة المهارات.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
