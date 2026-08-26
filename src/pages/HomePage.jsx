import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { SwapModal } from '../components/skills/SwapModal';
import { Star, Search, Sparkles } from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { skills, setSearchQuery, setSelectedCategory } = useSwap();
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      setActiveTab('skills');
    }
  };

  const handleCategoryClick = (catKey) => {
    setSelectedCategory(catKey);
    setActiveTab('skills');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-blob blob1"></div>
        <div className="hero-blob blob2"></div>
        <div className="hero-content">
          <h1>
            علّم ما تُتقنه
            <br />
            وتعلّم ما <span className="highlight">تحتاجه</span>
          </h1>
          <p className="hero-sub">
            تواصل مع أشخاص يريدون تعلّم مهاراتك وعلّمهم بالمقابل مهارات تريد أنت اكتسابها — بدون مال، فقط تبادل حقيقي للمثاقفة والمعرفة.
          </p>

          {/* Quick Search Bar */}
          <form className="hero-search-box" onSubmit={handleHeroSearch}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مهارة (مثال: React، تصميم، إسبانية...)"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="btn-search">
              بحث 🔍
            </button>
          </form>

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
              تصفح جميع المهارات
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how">
        <p className="section-label">الآلية</p>
        <h2 className="section-title">كيف يعمل التبادل؟</h2>
        <div className="divider"></div>
        <p className="section-sub">أربع خطوات بسيطة تفصلك عن اكتساب مهارة جديدة</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">📝</div>
            <div className="step-title">سجّل مهاراتك</div>
            <div className="step-desc">أضف المهارات التي تُتقنها وتريد تعليمها للآخرين.</div>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">🔍</div>
            <div className="step-title">ابحث وتصفّح</div>
            <div className="step-desc">استكشف المهارات المتاحة وابحث عن من يملك ما تحتاجه.</div>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">🤝</div>
            <div className="step-title">تواصل وتفاوض</div>
            <div className="step-desc">راسل الشخص واتفقوا على آلية وموعد التبادل.</div>
          </div>
          <div className="step-card">
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
          <div className="cat-card" onClick={() => handleCategoryClick('tech')}>
            <div className="cat-icon">💻</div>
            <div className="cat-name">تقنية وبرمجة</div>
          </div>
          <div className="cat-card" onClick={() => handleCategoryClick('design')}>
            <div className="cat-icon">🎨</div>
            <div className="cat-name">تصميم وفنون</div>
          </div>
          <div className="cat-card" onClick={() => handleCategoryClick('photo')}>
            <div className="cat-icon">📸</div>
            <div className="cat-name">تصوير وإنتاج</div>
          </div>
          <div className="cat-card" onClick={() => handleCategoryClick('business')}>
            <div className="cat-icon">📊</div>
            <div className="cat-name">أعمال وتسويق</div>
          </div>
          <div className="cat-card" onClick={() => handleCategoryClick('languages')}>
            <div className="cat-icon">🌍</div>
            <div className="cat-name">لغات وترجمة</div>
          </div>
          <div className="cat-card" onClick={() => handleCategoryClick('music')}>
            <div className="cat-icon">🎵</div>
            <div className="cat-name">موسيقى وصوت</div>
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
            <div key={skill.id} className="skill-card">
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

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <p className="section-label">تجارب أعضائنا</p>
        <h2 className="section-title">قصص نجاح في تبادل المهارات</h2>
        <div className="divider"></div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="t-user-info">
              <div className="t-avatar-box">أ ر</div>
              <div>
                <h4>أحمد رضا</h4>
                <span>مطور ويب</span>
              </div>
            </div>
            <p className="t-comment">
              "تبادلت خبرتي في برمجة React مقابل تعلم أساسيات تصميم UI/UX مع إحدى العضوات. تجربة ممتازة واختصرت علي شهوراً من التعلم الذاتي!"
            </p>
            <div className="t-stars">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="testimonial-card">
            <div className="t-user-info">
              <div className="t-avatar-box" style={{ background: 'var(--teal)', color: '#000' }}>س م</div>
              <div>
                <h4>سارة منصور</h4>
                <span>مصممة جرافيك</span>
              </div>
            </div>
            <p className="t-comment">
              "منصة مهارة هي المكان الأفضل لتبادل الخبرات بدون أي تكاليف مالية. تعلمت اللغة الإسبانية وعلمت تصميم الشعارات."
            </p>
            <div className="t-stars">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="testimonial-card">
            <div className="t-user-info">
              <div className="t-avatar-box" style={{ background: '#9c27b0', color: '#fff' }}>م ع</div>
              <div>
                <h4>محمد العتيبي</h4>
                <span>محلل بيانات</span>
              </div>
            </div>
            <p className="t-comment">
              "سهولة التواصل والتعامل بين الأعضاء تجعل عملية التبادل ممتعة ومفيدة جداً. أنصح كل من يود تطوير مهاراته بالانضمام."
            </p>
            <div className="t-stars">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section cta-section">
        <h2>جاهز تبدأ رحلتك؟</h2>
        <p>انضم لآلاف المحترفين الذين يتبادلون المعرفة يومياً</p>
        <button onClick={() => setActiveTab('register')} className="btn-cta">
          أنشئ حسابك
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
