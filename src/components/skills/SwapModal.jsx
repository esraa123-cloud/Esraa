import React, { useState } from 'react';
import { useSwap } from '../../context/SwapContext';
import { useAuth } from '../../context/AuthContext';
import { X, Send, CheckCircle2 } from 'lucide-react';

export const SwapModal = ({ targetSkill, onClose }) => {
  const { proposeSwap } = useSwap();
  const { currentUser } = useAuth();

  const teachSkills = (currentUser && currentUser.skillsTeach && currentUser.skillsTeach.length > 0)
    ? currentUser.skillsTeach
    : ['برمجة الويب'];

  const [selectedOffer, setSelectedOffer] = useState(teachSkills[0]);
  const [method, setMethod] = useState('online');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const res = await proposeSwap(targetSkill, selectedOffer);
    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.message || 'حدث خطأ أثناء تقديم طلب التبادل');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={54} color="var(--teal)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>تم إرسال الطلب بنجاح!</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              تم إرسال اقتراح التبادل إلى {targetSkill.owner}. يمكنك متابعة حالة الطلب في صفحة طلبات التبادل.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text)' }}>
              طلب تبادل مهارة 🤝
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              أنت تبحث عن: <strong style={{ color: 'var(--accent)' }}>{targetSkill.title}</strong> من <strong style={{ color: 'var(--text)' }}>{targetSkill.owner}</strong>
            </p>

            {errorMsg && (
              <div className="msg error" style={{ marginBottom: '1rem' }}>
                {errorMsg}
              </div>
            )}

            <div className="field" style={{ marginBottom: '1.2rem' }}>
              <label>المهارة التي تقدمها في المقابل:</label>
              <select value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)}>
                {teachSkills.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
                <option value="خبرات عامة وتصميم">خبرات عامة وتصميم</option>
              </select>
            </div>

            <div className="field" style={{ marginBottom: '1.2rem' }}>
              <label>طريقة التبادل المفضلة:</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="online">جلسات تفاعلية عبر زوم / غوغل ميت</option>
                <option value="chat">محادثة كتابية ومشاركة ملفات</option>
                <option value="in_person">لقاء مباشر (حسب التواجد)</option>
              </select>
            </div>

            <div className="field" style={{ marginBottom: '1.5rem' }}>
              <label>رسالة تقديمية (اختياري):</label>
              <textarea
                rows={3}
                placeholder="اكتب نبذة مختصرة عن هدفك وأوقات تواجدك المفضلة..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={submitting}>
              <Send size={18} />
              <span>{submitting ? 'جاري إرسال الطلب...' : 'إرسال طلب التبادل الان'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
