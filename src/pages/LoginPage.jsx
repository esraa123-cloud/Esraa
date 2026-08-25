import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const LoginPage = ({ setActiveTab }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setActiveTab('skills');
      }, 800);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '64px' }}>
      <div className="panel-left">
        <div className="geo-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="panel-quote">
          <div className="big-icon">⚡</div>
          <blockquote>
            مرحبًا بك في مجتمع
            <br />
            <em>تبادل المعرفة</em>
          </blockquote>
          <p>سجّل دخولك واستمر في رحلتك — مهاراتك تنتظرك.</p>
        </div>
        <div className="testimonials">
          <div className="t-avatar">🧑‍💻</div>
          <div className="t-text">
            <strong>أحمد خالد</strong>تعلمت التصميم في أسبوعين!
          </div>
        </div>
      </div>

      <div className="panel-right">
        <button onClick={() => setActiveTab('home')} className="back-link">
          <ArrowRight size={18} />
          <span>العودة للرئيسية</span>
        </button>

        <h1 className="form-heading">تسجيل الدخول</h1>
        <p className="form-sub">أدخل بياناتك للمتابعة في منصة مهارة</p>

        <form className="form-body" onSubmit={handleSubmit}>
          {msg.text && (
            <div className={`msg ${msg.type}`}>
              {msg.text}
            </div>
          )}

          <div className="field">
            <label>البريد الإلكتروني</label>
            <div className="input-wrap">
              <span className="icon">✉️</span>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="field">
            <label>كلمة المرور</label>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>

          <div className="field-row">
            <label className="remember">
              <input type="checkbox" /> تذكّرني
            </label>
            <button
              type="button"
              className="forgot"
              onClick={() => setActiveTab('recover')}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>

          <div className="divider-or">أو</div>

          <div className="social-login">
            <button type="button" className="btn-social">
              🌐 جوجل
            </button>
            <button type="button" className="btn-social">
              📘 فيسبوك
            </button>
          </div>

          <div className="form-footer">
            ليس لديك حساب؟{' '}
            <button type="button" onClick={() => setActiveTab('register')}>
              سجّل الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
