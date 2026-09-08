import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PhotoGridCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  caption?: string;
  onClick?: () => void;
  className?: string;
}

export const PhotoGridCard: React.FC<PhotoGridCardProps> = ({
  id,
  title,
  date,
  imageUrl,
  caption,
  onClick,
  className = '',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`फोटो देखें: ${title}`}
      className={`flex flex-col gap-1.5 cursor-pointer group tap-active text-left ${className}`}
    >
      {/* Photo Thumbnail Container */}
      <div className="relative w-full aspect-square rounded-xl bg-[#FAF8F5] border border-[#E8E5DF] overflow-hidden flex items-center justify-center group-hover:border-[#CBD5E1] transition-colors">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[#5C6773]">
            <ImageIcon size={24} className="text-[#16325C]/40 mb-1" />
            <span className="text-[11px]">फोटो</span>
          </div>
        )}
      </div>

      {/* Title & Date Underneath */}
      <div className="px-0.5">
        <h4 className="text-[13px] font-semibold text-[#16325C] leading-snug line-clamp-2 group-hover:text-[#0F2342] transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-[#78828D] font-medium mt-0.5">
          {date}
        </p>
      </div>
    </div>
  );
};
