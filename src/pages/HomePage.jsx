import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { SwapModal } from '../components/skills/SwapModal';
import { Reveal } from '../components/common/Reveal';
import { Star, Search } from 'lucide-react';

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
          <Reveal variant="fade-up" delay={0}>
            <h1>
              علّم ما تُتقنه
              <br />
              وتعلّم ما <span className="highlight">تحتاجه</span>
            </h1>
          </Reveal>

          <Reveal variant="fade-up" delay={0.1}>
            <p className="hero-sub">
              تواصل مع أشخاص يريدون تعلّم مهاراتك وعلّمهم بالمقابل مهارات تريد أنت اكتسابها — بدون مال، فقط تبادل حقيقي للمثاقفة والمعرفة.
            </p>
          </Reveal>

          {/* Quick Search Bar */}
          <Reveal variant="scale-in" delay={0.2}>
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
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
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
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how">
        <Reveal variant="fade-up" delay={0}>
          <p className="section-label">الآلية</p>
          <h2 className="section-title">كيف يعمل التبادل؟</h2>
          <div className="divider"></div>
          <p className="section-sub">أربع خطوات بسيطة تفصلك عن اكتساب مهارة جديدة</p>
        </Reveal>

        <div className="steps-grid">
          {[
            { num: '01', icon: '📝', title: 'سجّل مهاراتك', desc: 'أضف المهارات التي تُتقنها وتريد تعليمها للآخرين.' },
            { num: '02', icon: '🔍', title: 'ابحث وتصفّح', desc: 'استكشف المهارات المتاحة وابحث عن من يملك ما تحتاجه.' },
            { num: '03', icon: '🤝', title: 'تواصل وتفاوض', desc: 'راسل الشخص واتفقوا على آلية وموعد التبادل.' },
            { num: '04', icon: '🚀', title: 'ابدأ التعلّم', desc: 'علّم، تعلّم، وقيّم التجربة لبناء سمعتك في المنصة.' },
          ].map((step, idx) => (
            <Reveal key={idx} variant="fade-up" delay={0.15 + idx * 0.08}>
              <div className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section cats-section">
        <Reveal variant="fade-up" delay={0}>
          <p className="section-label">التصنيفات</p>
          <h2 className="section-title">اكتشف مجالات التبادل</h2>
          <div className="divider"></div>
        </Reveal>

        <div className="cats-grid">
          {[
            { key: 'tech', icon: '💻', name: 'تقنية وبرمجة' },
            { key: 'design', icon: '🎨', name: 'تصميم وفنون' },
            { key: 'photo', icon: '📸', name: 'تصوير وإنتاج' },
            { key: 'business', icon: '📊', name: 'أعمال وتسويق' },
            { key: 'languages', icon: '🌍', name: 'لغات وترجمة' },
            { key: 'music', icon: '🎵', name: 'موسيقى وصوت' },
          ].map((cat, idx) => (
            <Reveal key={cat.key} variant="scale-in" delay={0.1 + idx * 0.06}>
              <div className="cat-card" onClick={() => handleCategoryClick(cat.key)}>
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section">
        <Reveal variant="fade-up" delay={0}>
          <p className="section-label">مميز</p>
          <h2 className="section-title">مهارات مطلوبة الآن</h2>
          <div className="divider"></div>
        </Reveal>

        <div className="skills-grid">
          {skills.slice(0, 3).map((skill, idx) => (
            <Reveal key={skill.id} variant="fade-up" delay={0.15 + idx * 0.1}>
              <div className="skill-card">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <Reveal variant="fade-up" delay={0}>
          <p className="section-label">تجارب أعضائنا</p>
          <h2 className="section-title">قصص نجاح في تبادل المهارات</h2>
          <div className="divider"></div>
        </Reveal>

        <div className="testimonials-grid">
          {[
            {
              avatar: 'إ ص',
              name: 'إسراء صلاح',
              job: 'مطورة ويب (قنا)',
              comment: '"تبادلت خبرتي في برمجة React مقابل تعلم أساسيات تصميم UI/UX مع إحدى العضوات. تجربة ممتازة واختصرت علي شهوراً من التعلم الذاتي!"',
              bg: undefined,
              color: undefined,
            },
            {
              avatar: 'س م',
              name: 'سارة منصور',
              job: 'مصممة جرافيك (الإسكندرية)',
              comment: '"منصة مهارة هي المكان الأفضل لتبادل الخبرات بدون أي تكاليف مالية. تعلمت تسويق المحتوى وعلمت تصميم الشعارات."',
              bg: 'var(--teal)',
              color: '#000',
            },
            {
              avatar: 'ن أ',
              name: 'نورهان أحمد',
              job: 'مترجمة ومدرسة إسبانية (الجيزة)',
              comment: '"سهولة التواصل والتعامل بين العضوات تجعل عملية التبادل ممتعة ومفيدة جداً. أنصح كل من تود تطوير مهاراتها بالانضمام."',
              bg: '#9c27b0',
              color: '#fff',
            },
          ].map((item, idx) => (
            <Reveal key={idx} variant="fade-up" delay={0.15 + idx * 0.1}>
              <div className="testimonial-card">
                <div className="t-user-info">
                  <div className="t-avatar-box" style={{ background: item.bg, color: item.color }}>
                    {item.avatar}
                  </div>
                  <div>
                    <h4>{item.name}</h4>
                    <span>{item.job}</span>
                  </div>
                </div>
                <p className="t-comment">{item.comment}</p>
                <div className="t-stars">⭐⭐⭐⭐⭐</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section cta-section">
        <Reveal variant="scale-in" delay={0.1}>
          <h2>جاهز تبدأ رحلتك؟</h2>
          <p>انضم لآلاف المحترفين الذين يتبادلون المعرفة يومياً</p>
          <button onClick={() => setActiveTab('register')} className="btn-cta">
            أنشئ حسابك
          </button>
        </Reveal>
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
