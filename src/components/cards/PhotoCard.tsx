import React from 'react';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { ShareButton } from '../ui/Buttons';

interface PhotoCardProps {
  title: string;
  imageUrl?: string;
  caption?: string;
  date?: string;
  category?: string;
  typeLabel?: string;
  onViewPhoto?: () => void;
  className?: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  title,
  imageUrl,
  caption,
  date,
  category,
  typeLabel = '🖼️ फोटो',
  onViewPhoto,
  className = '',
}) => {
  return (
    <ContentCard radius="md" className={`flex flex-col gap-3 p-3.5 ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
            {typeLabel}
          </span>
          {category && (
            <span className="text-[12px] font-medium text-[#5C6773] bg-[#FAF8F5] border border-[#E8E5DF] px-2 py-0.5 rounded-md">
              {category}
            </span>
          )}
        </div>

        {date && <DateLabel date={date} />}
      </div>

      {/* Image Container (16:10 Ratio) */}
      <div
        onClick={onViewPhoto}
        role="button"
        tabIndex={0}
        aria-label={`फोटो देखें: ${title}`}
        className="relative w-full aspect-16/10 rounded-xl bg-[#FAF8F5] border border-[#E8E5DF] overflow-hidden flex items-center justify-center cursor-pointer group"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
        ) : (
          /* Elegant peaceful placeholder */
          <div className="w-full h-full bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <span className="text-[12px] text-[#5C6773] font-medium">
              अहिंसा शिक्षा छायाचित्र
            </span>
          </div>
        )}
      </div>

      {/* Title & Caption */}
      <div className="flex flex-col gap-1 px-0.5">
        <h3
          onClick={onViewPhoto}
          className="text-[16px] font-semibold text-[#16325C] leading-snug cursor-pointer hover:underline decoration-[#16325C]/40"
        >
          {title}
        </h3>

        {caption && (
          <p className="text-[14px] text-[#5C6773] leading-relaxed">
            {caption}
          </p>
        )}
      </div>

      {/* Actions: फोटो देखें → & ↗ साझा करें */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E8E5DF]/50 mt-auto">
        <button
          type="button"
          onClick={onViewPhoto}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors py-1 tap-active"
        >
          <span>फोटो देखें</span>
          <ArrowRight size={14} />
        </button>

        <ShareButton title={title} />
      </div>
    </ContentCard>
  );
};
