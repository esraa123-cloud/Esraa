import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const RecoverPage = ({ setActiveTab }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleNextStep = (nextStep) => {
    if (step === 1 && !email) {
      setMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setMsg('');
    setStep(nextStep);
  };

  const handleFinishReset = () => {
    if (!newPassword || newPassword.length < 6) {
      setMsg('كلمة السر يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg('كلمتا السر غير متطابقتين');
      return;
    }
    setMsg('');
    alert('تم تحديث كلمة السر بنجاح! يمكن الآن تسجيل الدخول بها.');
    setActiveTab('login');
  };

  return (
    <div className="recover-wrapper" style={{ paddingTop: '80px' }}>
      <div className="recover-bg-glow rec-glow-1"></div>
      <div className="recover-bg-glow rec-glow-2"></div>

      <div className="recover-container">
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('login')} className="back-link">
            <ArrowRight size={18} />
            <span>العودة لتسجيل الدخول</span>
          </button>
        </div>

        <div className="rec-progress-container">
          <div
            className="rec-progress-bar"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>
          <div className={`rec-step ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>1</div>
          <div className={`rec-step ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
          <div className={`rec-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <div className="recover-card">
          <div className="icon-container">
            <div className={`lock-icon ${step === 2 ? 'pulse' : ''}`}>🔒</div>
          </div>

          <h2 className="rec-title">نسيت كلمة السر</h2>
          <p className="rec-subtitle">استعادة الحساب — تجربة بسيطة وسلسة</p>

          {msg && <div className="msg error" style={{ marginBottom: '1rem' }}>{msg}</div>}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div className="field" style={{ textAlign: 'right', marginBottom: '20px' }}>
                <label>البريد الإلكتروني</label>
                <div className="input-wrap">
                  <span className="icon">✉️</span>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button className="btn-submit" onClick={() => handleNextStep(2)}>
                إرسال رابط التأكيد
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div className="success-message">
                <div className="success-glow">✓</div>
                <p style={{ color: 'var(--text)', marginBottom: '20px' }}>
                  تم إرسال رمز التأكيد إلى بريدك الإلكتروني ({email}) بنجاح.
                </p>
              </div>
              <button className="btn-submit" onClick={() => handleNextStep(3)}>
                المتابعة لتغيير كلمة السر
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <div className="field" style={{ textAlign: 'right', marginBottom: '15px' }}>
                <label>كلمة السر الجديدة</label>
                <div className="input-wrap">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field" style={{ textAlign: 'right', marginBottom: '20px' }}>
                <label>تأكيد كلمة السر</label>
                <div className="input-wrap">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button className="btn-submit" onClick={handleFinishReset}>
                تحديث كلمة السر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
