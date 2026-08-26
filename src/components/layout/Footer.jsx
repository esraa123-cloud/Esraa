import React from 'react';

export const Footer = () => {
  return (
    <footer>
      <div className="logo">
        <div className="logo-symbol-wrap">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5a623" />
                <stop offset="100%" stopColor="#1de9b6" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#logoGradFooter)" fillOpacity="0.12" stroke="url(#logoGradFooter)" strokeWidth="1.5" />
            <path d="M10 12C10 9.79 11.79 8 14 8H18C20.21 8 22 9.79 22 12V13M22 20C22 22.21 20.21 24 18 24H14C11.79 24 10 22.21 10 20V19" stroke="url(#logoGradFooter)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M19.5 15L22.5 12L19.5 9" stroke="url(#logoGradFooter)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 17L9.5 20L12.5 23" stroke="url(#logoGradFooter)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="logo-brand-title">
          مهارة
        </div>
      </div>
      <div>© ٢٠٢٦ مهارة – جميع الحقوق محفوظة</div>
    </footer>
  );
};
