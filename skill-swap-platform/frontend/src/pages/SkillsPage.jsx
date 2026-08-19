import React, { useState } from 'react';
import { useSwap } from '../context/SwapContext';
import { useChat } from '../context/ChatContext';
import { SwapModal } from '../components/skills/SwapModal';
import { Search, Plus, MessageSquare, Star, Sparkles, Filter } from 'lucide-react';

export const SkillsPage = ({ setActiveTab }) => {
  const { skills, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, addSkill } = useSwap();
  const { startChatWithUser } = useChat();

  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New skill form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('tech');
  const [newWants, setNewWants] = useState('');
  const [newIcon, setNewIcon] = useState('💻');

  const categories = [
    { id: 'all', name: 'الكل 🌟' },
    { id: 'tech', name: 'تقنية وبرمجة 💻' },
    { id: 'design', name: 'تصميم وفنون 🎨' },
    { id: 'photo', name: 'تصوير وإنتاج 📸' },
    { id: 'business', name: 'أعمال وتسويق 📊' },
    { id: 'languages', name: 'لغات وترجمة 🌍' },
    { id: 'music', name: 'موسيقى وصوت 🎵' }
  ];

  const filteredSkills = skills.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.wants.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSkillSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newWants) return;

    addSkill({
      title: newTitle,
      category: newCategory,
      icon: newIcon,
      owner: 'أنت',
      location: 'مصر',
      wants: newWants
    });

    setNewTitle('');
    setNewWants('');
    setShowAddModal(false);
  };

  const handleDirectChat = (ownerName) => {
    startChatWithUser(ownerName);
    setActiveTab('messages');
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <section className="section" style={{ padding: '2rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="section-label">سوق التبادل المعرفي</span>
            <h1 className="section-title" style={{ textAlign: 'right', fontSize: '2.4rem' }}>
              المهارات المتاحة للتبادل 🤝
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              استكشف المهارات التي يقدمها أعضاء المجتمع، واقترح تبادلاً معرفياً فورياً
            </p>
          </div>

          <button className="btn-solid" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>إضافة مهارة جديدة</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div className="input-wrap" style={{ flex: '1', minWidth: '280px' }}>
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="ابحث باسم المهارة، الشخص، أو المهارة المطلوبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`skill-tag ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--muted)', background: 'var(--card)', borderRadius: '18px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>لا توجد مهارات تطابق بحثك حالياً</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>جرّب البحث بكلمات أخرى أو اختر تصنيفاً آخر</p>
          </div>
        ) : (
          <div className="skills-grid">
            {filteredSkills.map(skill => (
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn-outline"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => handleDirectChat(skill.owner)}
                        title="محادثة مباشرة"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        className="btn-solid"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
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
        )}
      </section>

      {/* Swap Request Modal */}
      {selectedSkillModal && (
        <SwapModal
          targetSkill={selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}

      {/* Add New Skill Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              إضافة مهارة جديدة لملفك ✦
            </h3>

            <form onSubmit={handleAddSkillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field">
                <label>عنوان المهارة التي تود تعليمها:</label>
                <input
                  type="text"
                  placeholder="مثال: تطوير تطبيقات Flutter أو تصميم الهويات"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>التصنيف:</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="tech">تقنية وبرمجة 💻</option>
                  <option value="design">تصميم وفنون 🎨</option>
                  <option value="photo">تصوير وإنتاج 📸</option>
                  <option value="business">أعمال وتسويق 📊</option>
                  <option value="languages">لغات وترجمة 🌍</option>
                  <option value="music">موسيقى وصوت 🎵</option>
                </select>
              </div>

              <div className="field">
                <label>المهارة التي ترغب في تعلمها بالمقابل:</label>
                <input
                  type="text"
                  placeholder="مثال: اللغة الإيطالية أو تسويق المحتوى"
                  value={newWants}
                  onChange={(e) => setNewWants(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }}>
                نشر المهارة الان
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
