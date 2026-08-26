import React from 'react';
import { Repeat } from 'lucide-react';

export const Footer = () => {
  return (
    <footer>
      <div className="logo">
        <div className="logo-icon-badge">
          <Repeat size={18} />
        </div>
        <div className="logo-text">
          مهارة<span className="logo-dot">.</span>
        </div>
      </div>
      <div>© ٢٠٢٦ مهارة – جميع الحقوق محفوظة</div>
    </footer>
  );
};
