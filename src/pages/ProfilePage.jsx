import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/common/Reveal';
import { MapPin, Award, Star, Edit3, Plus } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile, addTeachSkill, addLearnSkill, loading: authLoading } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setTitle(currentUser.title || '');
      setLocation(currentUser.location || currentUser.country || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  if (authLoading) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--muted)' }}>
        جاري تحميل البيانات... ⏳
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--muted)', minHeight: '60vh' }}>
        <Reveal variant="fade-up">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2>يرجى تسجيل الدخول لمشاهدة الملف الشخصي</h2>
        </Reveal>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ name, title, location, bio });
    setIsSaving(false);
    setShowEditModal(false);
  };

  const handleAddTeachSkillSubmit = async () => {
    if (!newTeachSkill.trim()) return;
    const skillToSave = newTeachSkill.trim();
    setNewTeachSkill('');
    if (addTeachSkill) {
      await addTeachSkill(skillToSave);
    } else {
      await updateProfile({
        skillsTeach: [...(currentUser.skillsTeach || []), skillToSave]
      });
    }
  };

  const handleAddLearnSkillSubmit = async () => {
    if (!newLearnSkill.trim()) return;
    const skillToSave = newLearnSkill.trim();
    setNewLearnSkill('');
    if (addLearnSkill) {
      await addLearnSkill(skillToSave);
    } else {
      await updateProfile({
        skillsLearn: [...(currentUser.skillsLearn || []), skillToSave]
      });
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <section className="section" style={{ padding: '2rem 4rem' }}>
        {/* Profile Card Header */}
        <Reveal variant="fade-up" delay={0}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', maxWidth: '950px', margin: '0 auto 2rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', color: '#000', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentUser.avatar || 'ع'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{currentUser.name}</h1>
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '700' }}>@{currentUser.username}</span>
                </div>
                <p style={{ color: 'var(--teal)', fontSize: '1rem', fontWeight: '600', marginTop: '0.2rem' }}>{currentUser.title || 'عضو في منصة مهارة'}</p>
                <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {currentUser.location || currentUser.country || 'غير محدد'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} color="var(--accent)" fill="var(--accent)" /> {currentUser.rating ?? 5.0} تقييم</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Award size={14} color="var(--teal)" /> {currentUser.swapsCompleted ?? 0} تبادل ناجح</span>
                </div>
              </div>

              <button className="btn-outline" onClick={() => setShowEditModal(true)}>
                <Edit3 size={16} />
                <span>تعديل الملف</span>
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>النبذة التعريفية</h3>
              <p style={{ color: 'var(--text)', fontSize: '0.98rem', lineHeight: '1.7' }}>{currentUser.bio || 'لا توجد نبذة تعريفية مضافة بعد.'}</p>
            </div>
          </div>
        </Reveal>

        {/* Skills Management Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', maxWidth: '950px', margin: '0 auto' }}>
          {/* Teach Skills */}
          <Reveal variant="fade-up" delay={0.1}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--accent)' }}>
                مهارات أتمكن من تعليمها ✦
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                {(currentUser.skillsTeach || []).map((s, idx) => (
                  <span key={idx} className="skill-tag selected">
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="أضف مهارة جديدة لتعليمها..."
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTeachSkillSubmit(); }}
                />
                <button className="btn-solid" onClick={handleAddTeachSkillSubmit} style={{ padding: '0.6rem' }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Learn Skills */}
          <Reveal variant="fade-up" delay={0.2}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--teal)' }}>
                مهارات أرغب في تعلمها 🎯
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                {(currentUser.skillsLearn || []).map((s, idx) => (
                  <span key={idx} className="skill-tag" style={{ borderColor: 'var(--teal)', color: 'var(--teal)', background: 'rgba(29,233,182,0.1)' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="أضف مهارة تود تعلمها..."
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddLearnSkillSubmit(); }}
                />
                <button className="btn-solid" onClick={handleAddLearnSkillSubmit} style={{ padding: '0.6rem', background: 'var(--teal)' }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>تعديل البيانات الشخصية</h3>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field">
                <label>الاسم الكامل:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label>المسمى الوظيفي / التخصص:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="field">
                <label>الموقع / البلد:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="field">
                <label>النبذة التعريفية:</label>
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} required />
              </div>
              <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }} disabled={isSaving}>
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
