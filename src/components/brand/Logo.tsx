import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 36,
  className = '',
  showText = false,
  textColor = 'text-[#16325C]',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Ahimsa Shiksha Mission Logo */}
      <img
        src="/logo.svg"
        alt="अहिंसा शिक्षा मिशन Logo"
        width={size}
        height={size}
        className="rounded-full shrink-0 object-contain shadow-xs"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className={`text-[17px] font-bold tracking-tight ${textColor}`}>
            अहिंसा शिक्षा मिशन
          </span>
          <span className="text-[11px] text-[#5C6773] font-medium tracking-normal">
            सत्य • अहिंसा • शिक्षा • मानवता
          </span>
        </div>
      )}
    </div>
  );
};
