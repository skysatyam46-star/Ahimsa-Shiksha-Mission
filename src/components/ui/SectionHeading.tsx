import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  level?: 1 | 2 | 3;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  action,
  level = 2,
  className = '',
}) => {
  const headingClasses = {
    1: 'text-[24px] font-bold text-[#16325C] tracking-tight',
    2: 'text-[20px] font-semibold text-[#16325C] tracking-tight',
    3: 'text-[18px] font-medium text-[#16325C] tracking-tight',
  }[level];

  return (
    <div className={`flex flex-col gap-1 mb-3.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className={`${headingClasses} leading-snug`}>
            {title}
          </h2>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF3FA] text-[#16325C] border border-[#16325C]/10">
              {badge}
            </span>
          )}
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-[13px] font-medium text-[#16325C] hover:underline shrink-0 tap-active p-1 -mr-1"
          >
            {action.label}
          </button>
        )}
      </div>

      {subtitle && (
        <p className="text-[14px] text-[#5C6773] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
