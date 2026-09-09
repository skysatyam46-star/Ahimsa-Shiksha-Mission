import React from 'react';
import { Bell, Info } from 'lucide-react';
import { CardActionRow } from './CardActionRow';

interface NoticeCardProps {
  id?: string;
  title: string;
  message: string;
  date?: string;
  typeLabel?: string;
  actionText?: string;
  onAction?: () => void;
  onClick?: () => void;
  variant?: 'gold' | 'blue' | 'green';
  className?: string;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  id,
  title,
  message,
  date,
  typeLabel = '📢 सूचना',
  actionText = 'पूरा पढ़ें →',
  onAction,
  onClick,
  variant = 'blue',
  className = '',
}) => {
  const styles = {
    blue: {
      card: 'bg-[#FAF8F5] border-[#E8E5DF] text-[#16325C] hover:border-[#CBD5E1]',
      iconBox: 'bg-[#EEF3FA] text-[#16325C]',
      icon: Info,
    },
    gold: {
      card: 'bg-[#FEF8EC] border-[#D97706]/20 text-[#8B4513] hover:border-[#D97706]/40',
      iconBox: 'bg-[#D97706]/15 text-[#B45309]',
      icon: Bell,
    },
    green: {
      card: 'bg-[#F0FDF4] border-[#2E7D32]/20 text-[#1B5E20] hover:border-[#2E7D32]/40',
      iconBox: 'bg-[#2E7D32]/15 text-[#2E7D32]',
      icon: Bell,
    },
  }[variant];

  const IconComponent = styles.icon;
  const handleCardClick = onClick || onAction;

  return (
    <div
      role={handleCardClick ? 'button' : undefined}
      tabIndex={handleCardClick ? 0 : undefined}
      onClick={handleCardClick}
      className={`w-full rounded-2xl border p-3.5 flex flex-col gap-2.5 transition-all shadow-2xs ${
        handleCardClick ? 'cursor-pointer group tap-active' : ''
      } ${styles.card} ${className}`}
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 pb-2">
        <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
          {typeLabel}
        </span>
        {date && (
          <span className="text-[12px] text-[#5C6773] shrink-0 font-medium">
            {date}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${styles.iconBox}`}>
          <IconComponent size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[15.5px] font-bold text-[#16325C] leading-snug line-clamp-2">
            {title}
          </h4>
          <p className="text-[14px] text-[#5C6773] leading-relaxed mt-1 line-clamp-3">
            {message}
          </p>
        </div>
      </div>

      {/* Action Row: 👍 पसंद | ↗ साझा करें | पूरा पढ़ें → */}
      <CardActionRow
        contentId={id}
        contentType="notice"
        contentTitle={title}
        title={title}
        text={message}
        onReadMore={handleCardClick}
        readMoreText={actionText}
      />
    </div>
  );
};

