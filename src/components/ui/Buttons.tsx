import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-[38px] px-3.5 text-[14px]',
    md: 'h-[44px] px-4 text-[15px]',
    lg: 'h-[48px] px-5 text-[16px]',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none tap-active ${
        disabled
          ? 'bg-[#E8E5DF] text-[#8C96A3] cursor-not-allowed'
          : 'bg-[#16325C] text-white hover:bg-[#0F2342] shadow-xs'
      } ${fullWidth ? 'w-full' : ''} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2 shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2 shrink-0">{icon}</span>}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-[38px] px-3.5 text-[14px]',
    md: 'h-[44px] px-4 text-[15px]',
    lg: 'h-[48px] px-5 text-[16px]',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none tap-active border ${
        disabled
          ? 'bg-[#FAF8F5] border-[#E8E5DF] text-[#8C96A3] cursor-not-allowed'
          : 'bg-white border-[#E8E5DF] text-[#16325C] hover:bg-[#FAF8F5] hover:border-[#16325C]/20 shadow-2xs'
      } ${fullWidth ? 'w-full' : ''} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2 shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2 shrink-0">{icon}</span>}
    </button>
  );
};

export const TextButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-[36px] px-2 text-[13px]',
    md: 'h-[40px] px-2.5 text-[14px]',
    lg: 'h-[44px] px-3 text-[15px]',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors select-none tap-active ${
        disabled
          ? 'text-[#8C96A3] cursor-not-allowed'
          : 'text-[#16325C] hover:text-[#0F2342] hover:bg-[#16325C]/5'
      } ${fullWidth ? 'w-full' : ''} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-1.5 shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-1.5 shrink-0">{icon}</span>}
    </button>
  );
};

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'icon' | 'labeled';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'अहिंसा शिक्षा मिशन',
  text = 'शांत • सरल • मानवीय • ज्ञानपूर्ण विचार',
  url,
  variant = 'icon',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if user dismissed or platform unsupported
      }
    }

    // Fallback: Copy URL to clipboard
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // noop
    }
  };

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label="साझा करें"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors tap-active ${
          copied
            ? 'bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20'
            : 'bg-[#FAF8F5] text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA] border border-[#E8E5DF]'
        } ${className}`}
      >
        {copied ? <Check size={14} className="text-[#2E7D32]" /> : <Share2 size={14} />}
        <span>{copied ? 'कॉपी हो गया' : 'साझा करें'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="साझा करें"
      title="साझा करें"
      className={`w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors tap-active ${
        copied
          ? 'bg-[#F0FDF4] text-[#2E7D32]'
          : 'text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA]'
      } ${className}`}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
    </button>
  );
};
