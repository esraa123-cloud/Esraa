import React from 'react';
import { Zap, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2.5rem 3rem 1.5rem',
        marginTop: '3rem',
        color: 'var(--muted)',
        fontSize: '0.9rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.6rem' }}>
            <Zap size={20} color="var(--accent)" />
            <span>مهارة</span>
          </div>
          <p style={{ maxWidth: '320px', lineHeight: '1.7' }}>
            منصة عربية لتبادل المهارات المعرفية بين الأشخاص، بدون مقابل مادي، فقط تبادل حقيقي للمعرفة والخبرة.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text)', marginBottom: '0.6rem', fontSize: '1rem' }}>تواصل معنا</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Mail size={14} />
            <span>support@mahara.io</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} />
            <span>القاهرة، مصر</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)' }}>
        © {new Date().getFullYear()} منصة مهارة — جميع الحقوق محفوظة لفريق Codex_Nova
      </div>
    </footer>
  );
};
