import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface SearchResultCardProps {
  typeLabel: string;
  title: string;
  excerpt: string;
  date: string;
  onClick?: () => void;
  className?: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  typeLabel,
  title,
  excerpt,
  date,
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
      className={`w-full bg-white border border-[#E8E5DF] rounded-2xl p-4 flex flex-col gap-2 transition-all hover:border-[#16325C]/30 hover:shadow-2xs tap-active cursor-pointer group ${className}`}
    >
      {/* Type badge and Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
          {typeLabel}
        </span>
        <span className="text-[12px] text-[#5C6773]">{date}</span>
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-[#16325C] leading-snug group-hover:text-[#0F2342] group-hover:underline decoration-[#16325C]/30">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-[13px] text-[#5C6773] leading-relaxed line-clamp-2">
        “{excerpt}”
      </p>

      {/* Action footer */}
      <div className="pt-2 border-t border-[#E8E5DF]/60 flex items-center justify-between mt-0.5">
        <span className="text-[12px] text-[#8C96A3]">विस्तार से देखें</span>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] group-hover:text-[#0F2342]">
          <span>देखें</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
