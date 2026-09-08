import React from 'react';
import { Calendar } from 'lucide-react';

interface DateLabelProps {
  date: string;
  showIcon?: boolean;
  className?: string;
}

export const DateLabel: React.FC<DateLabelProps> = ({
  date,
  showIcon = true,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5C6773] tracking-tight ${className}`}
    >
      {showIcon && <Calendar size={13} className="text-[#8C96A3] shrink-0" />}
      <span>{date}</span>
    </span>
  );
};
