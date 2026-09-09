import React from 'react';
import { Play } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { CardActionRow } from './CardActionRow';

interface VideoCardProps {
  id?: string;
  title: string;
  duration: string;
  thumbnailUrl?: string;
  speaker?: string;
  date?: string;
  category?: string;
  typeLabel?: string;
  description?: string;
  thumbnailFirst?: boolean;
  onClick?: () => void;
  className?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  duration,
  thumbnailUrl,
  speaker,
  date,
  category,
  typeLabel = '🎥 वीडियो',
  description,
  thumbnailFirst = false,
  onClick,
  className = '',
}) => {
  const renderThumbnail = () => (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`वीडियो देखें: ${title}`}
      className="relative w-full aspect-video rounded-xl bg-[#16325C]/5 border border-[#E8E5DF] overflow-hidden flex items-center justify-center cursor-pointer group"
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-[#EEF3FA] via-[#FAF8F5] to-[#E9F0F8] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-11 h-11 rounded-full bg-[#16325C] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>
      )}

      {/* Persistent Central Play Button Overlay */}
      <div className="absolute inset-0 bg-black/15 flex items-center justify-center transition-colors group-hover:bg-black/25">
        <div className="w-11 h-11 rounded-full bg-[#16325C]/90 text-white flex items-center justify-center shadow-xs backdrop-blur-xs group-hover:scale-105 transition-transform">
          <Play size={18} fill="currentColor" className="ml-0.5" />
        </div>
      </div>

      {/* Duration Badge */}
      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#1F2421]/80 text-white text-[11px] font-medium tracking-wide backdrop-blur-xs">
        {duration}
      </span>
    </div>
  );

  const renderMetaBar = () => (
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
  );

  return (
    <ContentCard radius="md" className={`flex flex-col gap-2.5 p-3.5 ${className}`}>
      {thumbnailFirst ? (
        <>
          {renderThumbnail()}
          {renderMetaBar()}
        </>
      ) : (
        <>
          {renderMetaBar()}
          {renderThumbnail()}
        </>
      )}

      {/* Title & Details */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3
          onClick={onClick}
          className="text-[15.5px] font-bold text-[#16325C] leading-snug line-clamp-2 cursor-pointer hover:underline"
        >
          {title}
        </h3>

        {description && (
          <p className="text-[13.5px] text-[#5C6773] leading-normal line-clamp-2 mt-0.5">
            {description}
          </p>
        )}

        {speaker && !description && (
          <p className="text-[12.5px] text-[#5C6773] mt-0.5">
            वक्ता: <span className="font-semibold text-[#1F2421]">{speaker}</span>
          </p>
        )}
      </div>

      {/* Actions: 👍 पसंद | ↗ साझा करें | वीडियो देखें → */}
      <CardActionRow
        contentId={id}
        contentType="video"
        contentTitle={title}
        title={title}
        text={description || title}
        onReadMore={onClick}
        readMoreText="वीडियो देखें →"
      />
    </ContentCard>
  );
};

