import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { TEAM_MEMBERS } from '../data/initialData';
import { SwapModal } from '../components/skills/SwapModal';
import { ArrowLeft, Sparkles, Users, Award, BookOpen, Star } from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { skills } = useSwap();
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-blob blob1"></div>
        <div className="hero-blob blob2"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>منصة تبادل المهارات الأولى عربياً</span>
          </div>
          <h1>
            علّم ما تُتقنه
            <br />
            وتعلّم ما <span className="highlight">تحتاجه</span>
          </h1>
          <p className="hero-sub">
            تواصل مع أشخاص يريدون تعلّم مهاراتك وعلّمهم بالمقابل مهارات تريد أنت اكتسابها — بدون مال، فقط تبادل حقيقي للمثاقفة والمعرفة.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => setActiveTab('register')}
              className="btn-hero btn-hero-primary"
            >
              ابدأ التبادل الآن
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className="btn-hero btn-hero-ghost"
            >
              تصفح المهارات 🔍
            </button>
          </div>
        </div>
      </section>

      {/* About Platform & Codex_Nova Team */}
      <section className="section" id="aboutSection">
        <p className="section-label">رسالتنا</p>
        <h2 className="section-title">عن منصة مهارة</h2>
        <div className="divider"></div>
        <p className="section-sub">تعرّف على الرؤية التي تقود منصتنا والفريق المطور لها</p>

        <div className="about-box floating-card">
          <p className="about-text">
            منصة مهارة هي منصة تعليمية تبادلية تهدف إلى تعزيز التعلم التبادلي والتكافلي؛
            بحيث إذا كان هناك شخص يمتلك مهارة معينة ويحتاج إلى تعلم مهارة أخرى،
            يمكنه بسهولة التواصل مع شخص آخر يتبادل معه هذه الخبرات والمعارف بشكل مرن ومباشر.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how">
        <p className="section-label">الآلية</p>
        <h2 className="section-title">كيف يعمل التبادل؟</h2>
        <div className="divider"></div>
        <p className="section-sub">أربع خطوات بسيطة تفصلك عن اكتساب مهارة جديدة</p>

        <div className="steps-grid">
          <div className="step-card floating-card">
            <div className="step-num">01</div>
            <div className="step-icon">📝</div>
            <div className="step-title">سجّل مهاراتك</div>
            <div className="step-desc">أضف المهارات التي تُتقنها وتريد تعليمها للآخرين.</div>
          </div>
          <div className="step-card floating-card">
            <div className="step-num">02</div>
            <div className="step-icon">🔍</div>
            <div className="step-title">ابحث وتصفّح</div>
            <div className="step-desc">استكشف المهارات المتاحة وابحث عن من يملك ما تحتاجه.</div>
          </div>
          <div className="step-card floating-card">
            <div className="step-num">03</div>
            <div className="step-icon">🤝</div>
            <div className="step-title">تواصل وتفاوض</div>
            <div className="step-desc">راسل الشخص واتفقوا على آلية وموعد التبادل.</div>
          </div>
          <div className="step-card floating-card">
            <div className="step-num">04</div>
            <div className="step-icon">🚀</div>
            <div className="step-title">ابدأ التعلّم</div>
            <div className="step-desc">علّم، تعلّم، وقيّم التجربة لبناء سمعتك في المنصة.</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section cats-section">
        <p className="section-label">التصنيفات</p>
        <h2 className="section-title">اكتشف مجالات التبادل</h2>
        <div className="divider"></div>
        <div className="cats-grid">
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">💻</div>
            <div className="cat-name">تقنية وبرمجة</div>
            <div className="cat-count">١٤٢ مهارة</div>
          </div>
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">🎨</div>
            <div className="cat-name">تصميم وفنون</div>
            <div className="cat-count">٩٨ مهارة</div>
          </div>
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">📸</div>
            <div className="cat-name">تصوير وإنتاج</div>
            <div className="cat-count">٦٤ مهارة</div>
          </div>
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">📊</div>
            <div className="cat-name">أعمال وتسويق</div>
            <div className="cat-count">٨٧ مهارة</div>
          </div>
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">🌍</div>
            <div className="cat-name">لغات وترجمة</div>
            <div className="cat-count">٥٣ مهارة</div>
          </div>
          <div className="cat-card floating-card" onClick={() => setActiveTab('skills')}>
            <div className="cat-icon">🎵</div>
            <div className="cat-name">موسيقى وصوت</div>
            <div className="cat-count">٤١ مهارة</div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section">
        <p className="section-label">مميز</p>
        <h2 className="section-title">مهارات مطلوبة الآن</h2>
        <div className="divider"></div>
        <div className="skills-grid">
          {skills.slice(0, 3).map((skill) => (
            <div key={skill.id} className="skill-card floating-card">
              <div className="skill-card-top" style={{ background: skill.bg }}>
                <span>{skill.icon}</span>
                <div className="tag-exchange">تبادل</div>
              </div>
              <div className="skill-card-body">
                <div className="skill-title">{skill.title}</div>
                <div className="skill-owner">
                  <span>👤</span>
                  <span>{skill.owner} · {skill.location}</span>
                </div>
                <div className="skill-footer">
                  <div className="skill-wants">
                    يريد: <strong>{skill.wants}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="rating">
                      <Star size={14} fill="var(--accent)" color="var(--accent)" />
                      <span>{skill.rating}</span>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => setSelectedSkillModal(skill)}
                    >
                      طلب تبادل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section cta-section">
        <h2>جاهز تبدأ رحلتك؟</h2>
        <p>انضم لآلاف المحترفين الذين يتبادلون المعرفة يومياً</p>
        <button onClick={() => setActiveTab('register')} className="btn-cta">
          أنشئ حسابك مجاناً
        </button>
      </section>

      {selectedSkillModal && (
        <SwapModal
          targetSkill={selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}
    </div>
  );
};
