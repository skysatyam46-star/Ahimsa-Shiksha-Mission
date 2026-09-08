import React from 'react';
import { Logo } from '../brand/Logo';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      id="global-footer"
      className={`w-full py-8 px-4 flex flex-col items-center justify-center text-center border-t border-[#E8E5DF]/70 mt-10 mb-6 ${className}`}
    >
      <Logo size={40} className="mb-2.5" />

      <p className="text-[16px] font-semibold text-[#16325C] tracking-tight mb-1">
        अहिंसा शिक्षा मिशन
      </p>

      <p className="text-[13px] text-[#5C6773] tracking-wide font-normal mb-3">
        सत्य • अहिंसा • शिक्षा • मानवता
      </p>

      <p className="text-[11px] text-[#8C96A3] tracking-tight">
        शांत • सरल • मानवीय • विश्वसनीय • ज्ञानपूर्ण
      </p>
    </footer>
  );
};
