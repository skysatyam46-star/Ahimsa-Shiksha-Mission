import React from 'react';

interface AdminStatCardProps {
  icon: React.ReactNode;
  label: string;
  hindiLabel?: string;
  count: number | string;
  accentColor?: 'blue' | 'green' | 'gold' | 'red' | 'purple' | 'amber';
  onClick?: () => void;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  icon,
  label,
  hindiLabel,
  count,
  accentColor = 'blue',
  onClick,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-[#EEF3FA]',
      text: 'text-[#16325C]',
      border: 'border-[#16325C]/15',
    },
    green: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#2E7D32]',
      border: 'border-[#2E7D32]/20',
    },
    gold: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#D97706]',
      border: 'border-[#D97706]/20',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
  };

  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`p-3.5 bg-white border border-[#E8E5DF] rounded-2xl shadow-2xs flex flex-col justify-between transition-all select-none ${
        onClick ? 'cursor-pointer hover:border-[#16325C]/40 hover:shadow-xs tap-active' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} border ${colors.border}`}
        >
          {icon}
        </div>
        <span className="text-[11px] font-medium text-[#5C6773] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E8E5DF]">
          Items
        </span>
      </div>

      <div>
        <div className="text-[24px] font-bold text-[#16325C] tracking-tight leading-none">
          {count}
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-[13px] font-semibold text-[#1F2421]">
            {label}
          </span>
          {hindiLabel && (
            <span className="text-[11px] text-[#5C6773]">
              ({hindiLabel})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
