import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { ImageZoomModal } from '../ui/ImageZoomModal';
import { CardActionRow } from './CardActionRow';

interface PhotoCardProps {
  id?: string;
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
  id,
  title,
  imageUrl,
  caption,
  date,
  category,
  typeLabel = '🖼️ फोटो',
  onViewPhoto,
  className = '',
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrl) {
      setIsZoomOpen(true);
    } else if (onViewPhoto) {
      onViewPhoto();
    }
  };

  return (
    <>
      <ContentCard radius="md" className={`flex flex-col gap-2.5 p-3.5 ${className}`}>
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

        {/* Image Container (Controlled 16:9 Ratio) */}
        <div
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          aria-label={`फोटो देखें एवं ज़ूम करें: ${title}`}
          className="relative w-full aspect-16/9 rounded-xl bg-[#FAF8F5] border border-[#E8E5DF] overflow-hidden flex items-center justify-center cursor-pointer group"
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-[13px] backdrop-blur-[2px]">
                <ZoomIn size={18} />
                <span>ज़ूम करके देखें</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                <ZoomIn size={12} />
                <span>ज़ूम</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center mb-1.5">
                <ImageIcon size={20} />
              </div>
              <span className="text-[12px] text-[#5C6773] font-medium">
                अहिंसा शिक्षा छायाचित्र
              </span>
            </div>
          )}
        </div>

        {/* Title & Caption */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3
            onClick={onViewPhoto}
            className="text-[15.5px] font-bold text-[#16325C] leading-snug line-clamp-2 cursor-pointer hover:underline"
          >
            {title}
          </h3>

          {caption && (
            <p className="text-[13.5px] text-[#5C6773] leading-normal line-clamp-2">
              {caption}
            </p>
          )}
        </div>

        {/* Actions: 👍 पसंद | ↗ साझा करें | विवरण → */}
        <CardActionRow
          contentId={id}
          contentType="photo"
          contentTitle={title}
          title={title}
          text={caption || title}
          onReadMore={onViewPhoto}
          readMoreText="विवरण →"
        />
      </ContentCard>

      {imageUrl && (
        <ImageZoomModal
          isOpen={isZoomOpen}
          imageUrl={imageUrl}
          title={title}
          caption={caption}
          onClose={() => setIsZoomOpen(false)}
        />
      )}
    </>
  );
};

