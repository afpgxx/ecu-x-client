import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 64 }) => {
  return (
    <svg 
      width={size}
      height={size}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Chip Body */}
      <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3" className="opacity-90" fill="currentColor" fillOpacity="0.1"/>
      
      {/* Pins - Horizontal */}
      <path d="M12 22H6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 32H6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 42H6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      
      <path d="M52 22H58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M52 32H58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M52 42H58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      
      {/* Pins - Vertical */}
      <path d="M22 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M42 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      
      <path d="M22 52V58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 52V58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M42 52V58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Internal Pulse Signal */}
      <path d="M20 32H26L29 24L35 40L38 32H44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
    </svg>
  );
};