import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BackButtonProps {
  onBack?: () => void;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onBack,
  label,
  className = '',
}) => {
  const { t } = useApp();
  const displayLabel = label || t.back;

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={displayLabel}
      className={`inline-flex items-center gap-1.5 py-1.5 pr-3 text-[14px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors tap-active min-h-[44px] -ml-1 ${className}`}
    >
      <ArrowLeft size={18} strokeWidth={2.2} />
      <span>{displayLabel}</span>
    </button>
  );
};
