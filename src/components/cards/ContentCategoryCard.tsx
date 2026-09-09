import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ContentCategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: string;
  actionText?: string;
  onClick?: () => void;
  className?: string;
}

export const ContentCategoryCard: React.FC<ContentCategoryCardProps> = ({
  icon,
  title,
  description,
  count,
  actionText = 'देखें',
  onClick,
  className = '',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`w-full bg-white border border-[#E8E5DF] rounded-2xl py-3 px-4 flex flex-col gap-2 transition-all hover:border-[#16325C]/30 hover:shadow-2xs tap-active cursor-pointer group ${className}`}
    >
      {/* Top row: Icon and Action link */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center border border-[#16325C]/10 text-xl shrink-0">
          {icon}
        </div>
        <div className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] group-hover:text-[#0F2342] transition-colors">
          <span>{actionText}</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Center: Title & Description */}
      <div>
        <h3 className="text-[16px] font-semibold text-[#16325C] leading-snug">
          {title}
        </h3>
        <p className="text-[13px] text-[#5C6773] mt-0.5 leading-normal">
          {description}
        </p>
      </div>

      {/* Bottom meta row */}
      <div className="pt-1.5 border-t border-[#E8E5DF]/60 flex items-center text-[12px] text-[#5C6773]">
        <span className="font-medium bg-[#FAF8F5] border border-[#E8E5DF] px-2 py-0.5 rounded-md">
          {count}
        </span>
      </div>
    </div>
  );
};
