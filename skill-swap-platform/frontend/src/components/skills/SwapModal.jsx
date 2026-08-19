import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSwap } from '../../context/SwapContext';
import { X, RefreshCw } from 'lucide-react';

export const SwapModal = ({ targetSkill, onClose }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { requestSwap } = useSwap();

  const myTeachSkills = currentUser?.skillsTeach || [];
  const [offeredSkill, setOfferedSkill] = useState(myTeachSkills[0] || '');
  const [customSkill, setCustomSkill] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', success: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillToOffer = offeredSkill === '__custom__' ? customSkill.trim() : offeredSkill;

    if (!skillToOffer) {
      setStatus({ loading: false, message: 'يرجى تحديد المهارة التي ستقدمها', success: false });
      return;
    }

    setStatus({ loading: true, message: '', success: null });
    const res = await requestSwap({
      skillId: targetSkill.id || targetSkill._id,
      offeredSkill: skillToOffer,
      requestedSkill: targetSkill.title
    });

    if (res.success) {
      setStatus({ loading: false, message: 'تم إرسال طلب التبادل بنجاح! 🎉', success: true });
      setTimeout(onClose, 1200);
    } else {
      setStatus({ loading: false, message: res.message || 'حدث خطأ، حاول مرة أخرى', success: false });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={20} color="var(--accent)" />
          طلب تبادل مهارة
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
          مع <strong style={{ color: 'var(--text)' }}>{targetSkill.owner}</strong> · مهارة: <strong>{targetSkill.title}</strong>
        </p>

        {!isAuthenticated ? (
          <div className="msg error">يجب تسجيل الدخول أولاً لإرسال طلب تبادل.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status.message && <div className={`msg ${status.success ? 'success' : 'error'}`}>{status.message}</div>}

            <div className="field">
              <label>المهارة التي يريدها: </label>
              <input type="text" value={targetSkill.wants} disabled />
            </div>

            <div className="field">
              <label>المهارة التي ستقدمها بالمقابل:</label>
              <select value={offeredSkill} onChange={(e) => setOfferedSkill(e.target.value)}>
                {myTeachSkills.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
                <option value="__custom__">مهارة أخرى...</option>
              </select>
            </div>

            {offeredSkill === '__custom__' && (
              <div className="field">
                <label>اكتب اسم المهارة:</label>
                <input
                  type="text"
                  placeholder="مثال: تصميم الشعارات"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={status.loading}>
              {status.loading ? 'جاري الإرسال...' : 'إرسال طلب التبادل'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
