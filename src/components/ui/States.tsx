import React from 'react';
import {
  AlertCircle,
  RotateCcw,
  Sparkles,
  Headphones,
  Image as ImageIcon,
  FileText,
  Bell,
  BookOpen,
  Video,
  Search,
  ExternalLink,
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';

/* --------------------------------------------------
   EMPTY STATE
-------------------------------------------------- */
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'यहाँ अभी कोई सामग्री उपलब्ध नहीं है',
  description = 'कृपया बाद में पुनः देखें या अन्य अनुभागों का अवलोकन करें।',
  icon,
  actionText,
  onAction,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`w-full ${
        compact ? 'py-5 px-4' : 'py-12 px-6'
      } flex flex-col items-center justify-center text-center bg-white border border-[#E8E5DF] rounded-2xl ${className}`}
    >
      <div
        className={`rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center ${
          compact ? 'w-10 h-10 mb-2.5' : 'w-14 h-14 mb-4'
        }`}
      >
        {icon || <Sparkles size={compact ? 18 : 24} strokeWidth={1.8} />}
      </div>

      <h3 className={`${compact ? 'text-[15px]' : 'text-[17px]'} font-semibold text-[#16325C] mb-1 leading-snug`}>
        {title}
      </h3>

      <p className={`${compact ? 'text-[13px] mb-3.5' : 'text-[14px] mb-5'} text-[#5C6773] max-w-[320px] leading-relaxed`}>
        {description}
      </p>

      {actionText && onAction && (
        <SecondaryButton size="sm" onClick={onAction}>
          {actionText}
        </SecondaryButton>
      )}
    </div>
  );
};

/* --------------------------------------------------
   CONTENT-SPECIFIC REUSABLE EMPTY STATES
-------------------------------------------------- */
export const HomeEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई प्रकाशित सामग्री उपलब्ध नहीं है।',
  description = 'नई सामग्री जल्द यहाँ दिखाई देगी।',
  actionText,
  onAction,
  className = '',
  compact = false,
}) => (
  <EmptyState
    icon={<Sparkles size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const VicharEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई विचार उपलब्ध नहीं है',
  description = 'नए विचार और संदेश जल्द यहाँ प्रकाशित किए जाएँगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<BookOpen size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const VideoEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई वीडियो उपलब्ध नहीं है',
  description = 'नए वीडियो व्याख्यान जल्द यहाँ प्रकाशित किए जाएँगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<Video size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const AudioEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई ऑडियो उपलब्ध नहीं है',
  description = 'नए ऑडियो संदेश यहाँ दिखाई देंगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<Headphones size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const PhotoEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई फोटो उपलब्ध नहीं है',
  description = 'मिशन की गतिविधियों की नई तस्वीरें यहाँ दिखाई देंगी।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<ImageIcon size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const DocumentEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई दस्तावेज उपलब्ध नहीं है',
  description = 'नए दस्तावेज और अध्ययन सामग्री यहाँ दिखाई देंगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<FileText size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const NoticeEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई सूचना उपलब्ध नहीं है',
  description = 'मिशन की नई सूचनाएँ और अपडेट यहाँ दिखाई देंगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<Bell size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const SearchEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'कोई परिणाम नहीं मिला',
  description = 'किसी दूसरे शब्द से खोजने का प्रयास करें।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<Search size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

export const LinksEmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}> = ({
  title = 'अभी कोई महत्वपूर्ण लिंक नहीं है',
  description = 'महत्वपूर्ण लिंक जल्द जोड़े जाएँगे।',
  actionText,
  onAction,
  className = '',
  compact = true,
}) => (
  <EmptyState
    icon={<ExternalLink size={compact ? 18 : 24} strokeWidth={1.8} />}
    title={title}
    description={description}
    actionText={actionText}
    onAction={onAction}
    className={className}
    compact={compact}
  />
);

/* --------------------------------------------------
   LOADING STATE
-------------------------------------------------- */
interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'सामग्री लोड हो रही है...',
  variant = 'skeleton',
  className = '',
}) => {
  if (variant === 'spinner') {
    return (
      <div
        className={`w-full py-10 flex flex-col items-center justify-center gap-3 text-center ${className}`}
      >
        <div className="w-8 h-8 rounded-full border-3 border-[#EEF3FA] border-t-[#16325C] animate-spin" />
        <span className="text-[14px] text-[#5C6773] font-medium">
          {message}
        </span>
      </div>
    );
  }

  // Calm Editorial Skeleton Cards
  return (
    <div className={`w-full flex flex-col gap-3.5 animate-pulse ${className}`}>
      <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-[#EEF3FA] rounded-md" />
          <div className="h-3 w-16 bg-[#EEF3FA] rounded-md" />
        </div>
        <div className="h-5 w-3/4 bg-[#E8E5DF] rounded-md" />
        <div className="h-4 w-full bg-[#FAF8F5] rounded-md" />
        <div className="h-4 w-2/3 bg-[#FAF8F5] rounded-md" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 w-20 bg-[#EEF3FA] rounded-md" />
          <div className="h-8 w-8 bg-[#EEF3FA] rounded-full" />
        </div>
      </div>

      <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-4 flex flex-col gap-3">
        <div className="w-full aspect-video bg-[#EEF3FA] rounded-xl" />
        <div className="h-5 w-4/5 bg-[#E8E5DF] rounded-md" />
        <div className="h-4 w-1/2 bg-[#FAF8F5] rounded-md" />
      </div>
    </div>
  );
};

/* --------------------------------------------------
   ERROR STATE
-------------------------------------------------- */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'लोड करने में समस्या हुई',
  message = 'कृपया अपने इंटरनेट कनेक्शन की जांच करें और पुनः प्रयास करें।',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`w-full py-10 px-6 flex flex-col items-center justify-center text-center bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-3.5">
        <AlertCircle size={24} />
      </div>

      <h3 className="text-[17px] font-semibold text-[#16325C] mb-1 leading-snug">
        {title}
      </h3>

      <p className="text-[14px] text-[#5C6773] max-w-[280px] leading-relaxed mb-5">
        {message}
      </p>

      {onRetry && (
        <PrimaryButton
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={onRetry}
        >
          पुनः प्रयास करें
        </PrimaryButton>
      )}
    </div>
  );
};
