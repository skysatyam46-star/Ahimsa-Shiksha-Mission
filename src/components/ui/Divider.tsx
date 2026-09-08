import React from 'react';

interface DividerProps {
  label?: string;
  hasDot?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  hasDot = false,
  className = '',
}) => {
  if (label) {
    return (
      <div className={`relative flex items-center justify-center my-6 ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8E5DF]" />
        </div>
        <span className="relative px-3 bg-[#FAF8F5] text-[12px] font-medium text-[#8C96A3]">
          {label}
        </span>
      </div>
    );
  }

  if (hasDot) {
    return (
      <div className={`flex items-center justify-center gap-2 my-5 ${className}`}>
        <div className="h-[1px] flex-1 bg-[#E8E5DF]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#16325C]/30" />
        <div className="h-[1px] flex-1 bg-[#E8E5DF]" />
      </div>
    );
  }

  return <hr className={`my-4 border-t border-[#E8E5DF] ${className}`} />;
};
