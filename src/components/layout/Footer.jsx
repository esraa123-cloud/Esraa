import React from 'react';
import { TEAM_MEMBERS } from '../../data/initialData';

export const Footer = () => {
  return (
    <footer>
      <div className="logo">
        مهارة<span>.</span>
      </div>
      <div>
        تطوير فريق <strong style={{ color: 'var(--teal)' }}>Codex_Nova Team</strong> ({TEAM_MEMBERS.join(' · ')})
      </div>
      <div>© ٢٠٢٦ مهارة – جميع الحقوق محفوظة</div>
    </footer>
  );
};
