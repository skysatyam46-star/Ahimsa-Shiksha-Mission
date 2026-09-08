import React, { useState } from 'react';
import { Play, Pause, Headphones } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';

interface AudioListItemCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  speaker?: string;
  onClick?: () => void;
  className?: string;
}

export const AudioListItemCard: React.FC<AudioListItemCardProps> = ({
  id,
  title,
  description,
  date,
  duration,
  speaker,
  onClick,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <ContentCard
      radius="md"
      className={`p-4 flex flex-col gap-2.5 transition-all hover:border-[#CBD5E1] cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Header: Audio Icon + Title */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10 mt-0.5 group-hover:bg-[#E2ECF8] transition-colors">
          <Headphones size={20} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#16325C] leading-snug group-hover:text-[#0F2342] transition-colors">
            {title}
          </h3>
          {speaker && (
            <p className="text-[12px] text-[#5C6773] mt-0.5">
              वक्ता: <span className="font-medium text-[#1F2421]">{speaker}</span>
            </p>
          )}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-[14px] text-[#5C6773] leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Playing state visual indicator (subtle and calm) */}
      {isPlaying && (
        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#2E7D32]/25 px-2.5 py-1 rounded-lg text-[12px] text-[#2E7D32] font-medium animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span>ध्वनि संदेश चल रहा है...</span>
        </div>
      )}

      {/* Footer: Date, Duration, and Play Button */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E8E5DF]/60 mt-auto">
        <div className="flex flex-col">
          <DateLabel date={date} />
          <span className="text-[12px] font-mono font-medium text-[#5C6773] mt-0.5">
            {duration}
          </span>
        </div>

        {/* UI Play Button (stops propagation so clicking it doesn't immediately navigate) */}
        <button
          type="button"
          onClick={handlePlayToggle}
          aria-label={isPlaying ? 'रोकें' : 'सुनें'}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active shrink-0 shadow-2xs ${
            isPlaying
              ? 'bg-[#2E7D32] text-white'
              : 'bg-[#16325C] text-white hover:bg-[#0F2342]'
          }`}
        >
          {isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>
    </ContentCard>
  );
};
