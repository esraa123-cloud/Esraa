import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { useChat } from '../context/ChatContext';
import { RefreshCw, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

export const SwapsPage = ({ setActiveTab }) => {
  const { swaps, updateSwapStatus } = useSwap();
  const { startChatWithUser } = useChat();
  const [filter, setFilter] = useState('all');

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

  const handleChatWithUser = (userName) => {
    startChatWithUser(userName);
    setActiveTab('messages');
  };

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
        {filteredSwaps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--muted)', background: 'var(--card)', borderRadius: '18px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
            <h3>لا توجد طلبات تبادل في هذا القسم حالياً</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>تصفح المهارات المتاحة واقترح تبادلاً جديداً على باقي الأعضاء</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '900px' }}>
            {filteredSwaps.map(swap => (
              <div
                key={swap.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                      {swap.proposer} ↔ {swap.receiver}
                    </h3>
                    {getStatusBadge(swap.status)}
                  </div>

                  <div style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                    تقدم مهارة: <strong style={{ color: 'var(--accent)' }}>{swap.offeredSkill}</strong> مقابل تعلم: <strong style={{ color: 'var(--teal)' }}>{swap.requestedSkill}</strong>
                  </div>

                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    تاريخ الطلب: {swap.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {swap.status === 'pending' && (
                    <>
                      <button
                        className="btn-solid"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                        onClick={() => updateSwapStatus(swap.id, 'accepted')}
                      >
                        قبول الطلب ✓
                      </button>
                      <button
                        className="btn-outline"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                        onClick={() => updateSwapStatus(swap.id, 'rejected')}
                      >
                        رفض
                      </button>
                    </>
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
                        onClick={() => updateSwapStatus(swap.id, 'completed')}
                      >
                        إكمال التبادل 🎉
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
