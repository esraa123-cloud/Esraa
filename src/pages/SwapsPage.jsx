import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';

export const SwapsPage = ({ setActiveTab }) => {
  const { swaps, updateSwapStatus, loadingSwaps } = useSwap();
  const { startChatWithUser } = useChat();
  const { isLoggedIn } = useAuth();
  const [filter, setFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const filteredSwaps = swaps.filter(s => filter === 'all' || s.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span style={{ background: 'rgba(29, 233, 182, 0.15)', color: 'var(--teal)', border: '1px solid var(--teal)', padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>مقبول ✓</span>;
      case 'completed':
        return <span style={{ background: 'rgba(76, 175, 137, 0.15)', color: 'var(--success)', border: '1px solid var(--success)', padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>مكتمل 🎉</span>;
      case 'rejected':
        return <span style={{ background: 'rgba(224, 84, 84, 0.15)', color: 'var(--error)', border: '1px solid var(--error)', padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>مرفوض ✕</span>;
      default:
        return <span style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>قيد الانتظار ⏳</span>;
    }
  };

  const handleStatusChange = async (swapId, newStatus) => {
    setActionLoadingId(swapId);
    setMsg({ type: '', text: '' });

    const res = await updateSwapStatus(swapId, newStatus);
    setActionLoadingId(null);

    if (res.success) {
      setMsg({ type: 'success', text: res.message || 'تم تحديث حالة الطلب بنجاح' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } else {
      setMsg({ type: 'error', text: res.message || 'فشل تحديث حالة الطلب' });
    }
  };

  const handleChatWithUser = async (userName) => {
    await startChatWithUser(userName);
    setActiveTab('messages');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--muted)', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
        <h2>يرجى تسجيل الدخول لمشاهدة وإدارة طلبات التبادل</h2>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <section className="section" style={{ padding: '2rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="section-label">إدارة التبادلات</span>
          <h1 className="section-title" style={{ textAlign: 'right', fontSize: '2.4rem' }}>
            طلبات التبادل الخاصة بك 🤝
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            تابع الطلبات الواردة والصادرة، وقبول مقترحات التبادل الجديدة
          </p>
        </div>

        {msg.text && (
          <div
            className={`msg ${msg.type}`}
            style={{
              marginBottom: '1.5rem',
              padding: '0.8rem 1.2rem',
              borderRadius: '10px',
              fontWeight: '700',
              background: msg.type === 'success' ? 'rgba(29, 233, 182, 0.15)' : 'rgba(224, 84, 84, 0.15)',
              color: msg.type === 'success' ? 'var(--teal)' : 'var(--error)',
              border: `1px solid ${msg.type === 'success' ? 'var(--teal)' : 'var(--error)'}`
            }}
          >
            {msg.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button className={`skill-tag ${filter === 'all' ? 'selected' : ''}`} onClick={() => setFilter('all')}>
            الكل ({swaps.length})
          </button>
          <button className={`skill-tag ${filter === 'pending' ? 'selected' : ''}`} onClick={() => setFilter('pending')}>
            قيد الانتظار ({swaps.filter(s => s.status === 'pending').length})
          </button>
          <button className={`skill-tag ${filter === 'accepted' ? 'selected' : ''}`} onClick={() => setFilter('accepted')}>
            المقبولة ({swaps.filter(s => s.status === 'accepted').length})
          </button>
          <button className={`skill-tag ${filter === 'completed' ? 'selected' : ''}`} onClick={() => setFilter('completed')}>
            المكتملة ({swaps.filter(s => s.status === 'completed').length})
          </button>
        </div>

        {/* Swaps List */}
        {loadingSwaps ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--muted)' }}>
            جاري تحميل طلبات التبادل... ⏳
          </div>
        ) : filteredSwaps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--muted)', background: 'var(--card)', borderRadius: '18px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
            <h3>لا توجد طلبات تبادل في هذا القسم حالياً</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>تصفح المهارات المتاحة واقترح تبادلاً جديداً على باقي الأعضاء</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '900px' }}>
            {filteredSwaps.map(swap => {
              const swapId = swap.id || swap._id;
              const isLoadingThis = actionLoadingId === swapId;
              const isIncoming = swap.receiver === 'أنت' || swap.isReceiver;

              return (
                <div
                  key={swapId}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                        {swap.proposer} ↔ {swap.receiver}
                      </h3>
                      {getStatusBadge(swap.status)}
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: isIncoming ? 'rgba(106,90,249,0.2)' : 'rgba(245,166,35,0.2)', color: isIncoming ? '#a18cd1' : 'var(--accent)', fontWeight: '700' }}>
                        {isIncoming ? '📥 طلب وارد' : '📤 طلب صادر'}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                      تقدم مهارة: <strong style={{ color: 'var(--accent)' }}>{swap.offeredSkill}</strong> مقابل تعلم: <strong style={{ color: 'var(--teal)' }}>{swap.requestedSkill}</strong>
                    </div>

                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      تاريخ الطلب: {swap.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {swap.status === 'pending' && (
                      isIncoming ? (
                        <>
                          <button
                            className="btn-solid"
                            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                            onClick={() => handleStatusChange(swapId, 'accepted')}
                            disabled={isLoadingThis}
                          >
                            {isLoadingThis ? '...' : 'قبول الطلب ✓'}
                          </button>
                          <button
                            className="btn-outline"
                            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                            onClick={() => handleStatusChange(swapId, 'rejected')}
                            disabled={isLoadingThis}
                          >
                            {isLoadingThis ? '...' : 'رفض'}
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                          ⏳ في انتظار موافقة {swap.receiver}
                        </span>
                      )
                    )}

                    {swap.status === 'accepted' && (
                      <>
                        <button
                          className="btn-outline"
                          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                          onClick={() => handleChatWithUser(swap.receiver === 'أنت' ? swap.proposer : swap.receiver)}
                        >
                          <MessageSquare size={14} />
                          <span>محادثة</span>
                        </button>
                        <button
                          className="btn-solid"
                          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: 'var(--teal)' }}
                          onClick={() => handleStatusChange(swapId, 'completed')}
                          disabled={isLoadingThis}
                        >
                          {isLoadingThis ? '...' : 'إكمال التبادل 🎉'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
