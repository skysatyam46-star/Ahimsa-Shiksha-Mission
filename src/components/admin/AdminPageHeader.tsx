import React from 'react';
import { ArrowLeft, Plus, ExternalLink } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onBack?: () => void;
  backLabel?: string;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  badge,
  onBack,
  backLabel = 'वापस',
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="mb-5 pb-3 border-b border-[#E8E5DF] dark:border-[#334155]">
      {onBack && (
        <div className="mb-2.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#5C6773] dark:text-gray-300 hover:text-[#16325C] dark:hover:text-[#93C5FD] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ArrowLeft size={14} />
            <span>{backLabel}</span>
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[13px] text-[#5C6773] dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 hover:bg-[#E2ECF8] dark:hover:bg-slate-700 transition-colors tap-active shadow-2xs"
            >
              {secondaryAction.icon || <ExternalLink size={14} />}
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-xl text-[12.5px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] transition-colors tap-active shadow-xs"
            >
              {primaryAction.icon || <Plus size={15} strokeWidth={2.5} />}
              <span>{primaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
