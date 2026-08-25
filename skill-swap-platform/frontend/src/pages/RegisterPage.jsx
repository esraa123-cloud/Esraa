import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const RegisterPage = ({ setActiveTab }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    cpassword: '',
    username: '',
    country: 'مصر',
    job: '',
    skillsTeach: ['برمجة الويب'],
    skillsLearn: ['تصميم الجرافيك']
  });

  // Password strength state
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (field === 'password') {
      checkPasswordStrength(val);
    }
  };

  const toggleTeachSkill = (skillName) => {
    setFormData(prev => {
      const exists = prev.skillsTeach.includes(skillName);
      return {
        ...prev,
        skillsTeach: exists
          ? prev.skillsTeach.filter(s => s !== skillName)
          : [...prev.skillsTeach, skillName]
      };
    });
  };

  const toggleLearnSkill = (skillName) => {
    setFormData(prev => {
      const exists = prev.skillsLearn.includes(skillName);
      return {
        ...prev,
        skillsLearn: exists
          ? prev.skillsLearn.filter(s => s !== skillName)
          : [...prev.skillsLearn, skillName]
      };
    });
  };

  const handleNext = (currentStep) => {
    setMsg('');
    if (currentStep === 1) {
      if (!formData.fname || !formData.lname || !formData.email || !formData.password) {
        setMsg('يرجى ملء كافة الحقول المطلوبة في الخطوة الأولى');
        return;
      }
      if (formData.password !== formData.cpassword) {
        setMsg('كلمتا السر غير متطابقتين');
        return;
      }
      setStep(2);
    } else if (currentStep === 2) {
      if (!formData.username || !formData.job) {
        setMsg('يرجى إدخال اسم المستخدم والتخصص');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await register(formData);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setMsg(res.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '64px' }}>
      <div className="panel-left">
        <div className="dot-grid"></div>
        <div className="panel-content">
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>✦ مجاني تمامًا</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>ابدأ رحلتك في دقيقتين</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            أنشئ حسابك واستكشف آلاف المهارات التي تنتظرك لتشاركها مع أعضاء المنصة
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--card)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#000', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>١</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>بياناتك الأساسية</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>الاسم والبريد والرمز</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--card)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#000', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>٢</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>ملفك الشخصي</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>اسم المستخدم والتخصص</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--card)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#000', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>٣</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>مهاراتك المعرفية</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>ما تعلمه وما تبحث عنه</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-right">
        <button onClick={() => setActiveTab('home')} className="back-link">
          <ArrowRight size={18} />
          <span>العودة للرئيسية</span>
        </button>

        <h1 className="form-heading">إنشاء حساب جديد</h1>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>أهلاً بك في مهارة!</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              تم إنشاء حسابك بنجاح. الآن يمكنك استكشاف المهارات والتواصل مع أعضاء المجتمع.
            </p>
            <button
              className="btn-solid"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              onClick={() => setActiveTab('skills')}
            >
              ابدأ الاستكشاف والتبادل الان 🚀
            </button>
          </div>
        ) : (
          <div>
            <div className="progress-bar">
              <div className={`pb-step ${step >= 1 ? 'active' : ''}`}></div>
              <div className={`pb-step ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`pb-step ${step >= 3 ? 'active' : ''}`}></div>
              <span className="pb-label">الخطوة {step} من ٣</span>
            </div>

            {msg && <div className="msg error">{msg}</div>}

            <form onSubmit={handleSubmit} className="form-body">
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="two-col">
                    <div className="field">
                      <label>الاسم الأول</label>
                      <div className="input-wrap">
                        <span className="icon">👤</span>
                        <input
                          type="text"
                          placeholder="أسماء"
                          value={formData.fname}
                          onChange={(e) => handleInputChange('fname', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>اسم العائلة</label>
                      <div className="input-wrap">
                        <span className="icon">👤</span>
                        <input
                          type="text"
                          placeholder="أحمد"
                          value={formData.lname}
                          onChange={(e) => handleInputChange('lname', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label>البريد الإلكتروني</label>
                    <div className="input-wrap">
                      <span className="icon">✉️</span>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>كلمة المرور</label>
                    <div className="input-wrap">
                      <span className="icon">🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="٨ أحرف على الأقل"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-pass"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'إخفاء' : 'إظهار'}
                      </button>
                    </div>
                    <div className="pass-strength">
                      <div className={`ps-bar ${strength >= 1 ? 'weak' : ''}`}></div>
                      <div className={`ps-bar ${strength >= 2 ? 'medium' : ''}`}></div>
                      <div className={`ps-bar ${strength >= 3 ? 'medium' : ''}`}></div>
                      <div className={`ps-bar ${strength >= 4 ? 'strong' : ''}`}></div>
                    </div>
                    <span className="ps-label">
                      {strength === 0 ? '' : strength <= 2 ? 'ضعيفة' : strength === 3 ? 'متوسطة' : 'قوية جداً'}
                    </span>
                  </div>

                  <div className="field">
                    <label>تأكيد كلمة المرور</label>
                    <div className="input-wrap">
                      <span className="icon">🔒</span>
                      <input
                        type="password"
                        placeholder="أعد كتابة كلمة المرور"
                        value={formData.cpassword}
                        onChange={(e) => handleInputChange('cpassword', e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="button" className="btn-submit" onClick={() => handleNext(1)}>
                    التالي ←
                  </button>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="field">
                    <label>اسم المستخدم</label>
                    <div className="input-wrap">
                      <span className="icon">@</span>
                      <input
                        type="text"
                        placeholder="skillmaster_99"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>البلد</label>
                    <div className="input-wrap">
                      <span className="icon">🌍</span>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      >
                        <option value="مصر">مصر</option>
                        <option value="السعودية">السعودية</option>
                        <option value="الإمارات">الإمارات</option>
                        <option value="الأردن">الأردن</option>
                        <option value="المغرب">المغرب</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>المهنة / التخصص</label>
                    <div className="input-wrap">
                      <span className="icon">💼</span>
                      <input
                        type="text"
                        placeholder="مطور ويب، مصمم جرافيك، مترجم..."
                        value={formData.job}
                        onChange={(e) => handleInputChange('job', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="btn-row">
                    <button type="button" className="btn-back-step" onClick={() => setStep(1)}>
                      ← رجوع
                    </button>
                    <button type="button" className="btn-submit" onClick={() => handleNext(2)}>
                      التالي ←
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="field">
                    <label>المهارات التي تتقنها وتود تعليمها ✦</label>
                    <div className="skills-picker">
                      {['💻 برمجة الويب', '🎨 تصميم UI', '🗣️ لغات وترجمة', '📸 تصوير وفيديو', '📊 تسويق إلكتروني'].map((s, i) => (
                        <span
                          key={i}
                          className={`skill-tag ${formData.skillsTeach.includes(s) ? 'selected' : ''}`}
                          onClick={() => toggleTeachSkill(s)}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>المهارات التي تبحث عنها وتود تعلمها 🎯</label>
                    <div className="skills-picker">
                      {['🎨 تصميم الجرافيك', '📊 إدارة الأعمال', '🎵 عزف بيانو', '🍳 طهي واحتراف', '🏋️ لياقة وتغذية'].map((s, i) => (
                        <span
                          key={i}
                          className={`skill-tag ${formData.skillsLearn.includes(s) ? 'selected' : ''}`}
                          onClick={() => toggleLearnSkill(s)}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="terms-row">
                    <input type="checkbox" required defaultChecked />
                    <span>أوافق على شروط الاستخدام وسياسة الخصوصية لمنصة مهارة</span>
                  </div>

                  <div className="btn-row">
                    <button type="button" className="btn-back-step" onClick={() => setStep(2)}>
                      ← رجوع
                    </button>
                    <button type="submit" className="btn-submit">
                      إنشاء الحساب ✓
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
