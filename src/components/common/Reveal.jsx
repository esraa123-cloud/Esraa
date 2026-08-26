import React, { useEffect, useRef, useState } from 'react';

export const Reveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  style = {},
  threshold = 0.12,
  ...props
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}s` : '0s',
        transitionDuration: `${duration}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
