import React from 'react';
import { Logo } from '../brand/Logo';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      id="global-footer"
      className={`w-full pt-6 pb-8 px-4 flex flex-col items-center justify-center text-center border-t border-[#E8E5DF]/70 mt-6 mb-2 ${className}`}
    >
      <Logo size={36} className="mb-2.5" />

      <p className="text-[15px] font-semibold text-[#16325C] tracking-tight">
        अहिंसा शिक्षा मिशन
      </p>

      {/* Safe Area bottom spacing */}
      <div className="h-[env(safe-area-inset-bottom,12px)] w-full mt-2" />
    </footer>
  );
};
