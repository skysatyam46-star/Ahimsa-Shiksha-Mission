import React from 'react';

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 bg-white border border-[#E8E5DF] hover:border-[#16325C]/35 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all tap-active flex items-center gap-3 group min-h-[54px]"
    >
      <div className="w-8 h-8 rounded-lg bg-[#EEF3FA] text-[#16325C] group-hover:bg-[#16325C] group-hover:text-white transition-colors flex items-center justify-center shrink-0 border border-[#16325C]/10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors leading-snug truncate">
          {title}
        </div>
        {description && (
          <div className="text-[11px] text-[#5C6773] truncate leading-none mt-0.5">
            {description}
          </div>
        )}
      </div>
    </button>
  );
};
