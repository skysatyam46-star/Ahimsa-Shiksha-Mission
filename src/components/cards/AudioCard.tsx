import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { ShareButton } from '../ui/Buttons';

interface AudioCardProps {
  title: string;
  speaker?: string;
  duration: string;
  currentTime?: string;
  date?: string;
  category?: string;
  typeLabel?: string;
  progressPercent?: number;
  onOpen?: () => void;
  onClick?: () => void;
  className?: string;
}

export const AudioCard: React.FC<AudioCardProps> = ({
  title,
  speaker,
  duration = '02:35',
  currentTime = '01:14',
  date,
  category,
  typeLabel = '🎧 ऑडियो संदेश',
  progressPercent = 48,
  onOpen,
  onClick,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(progressPercent);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <ContentCard radius="md" className={`flex flex-col gap-3 p-4 ${className}`}>
      {/* Category and Date Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-semibold text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-2 py-0.5 rounded-md">
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

      {/* Main Title & Speaker */}
      <div>
        <h3
          onClick={onOpen || onClick}
          className={`text-[16px] font-semibold text-[#16325C] leading-snug ${
            onOpen || onClick ? 'cursor-pointer hover:underline' : ''
          }`}
        >
          {title}
        </h3>
        {speaker && (
          <p className="text-[13px] text-[#5C6773] mt-0.5">
            वक्ता: <span className="font-medium text-[#1F2421]">{speaker}</span>
          </p>
        )}
      </div>

      {/* Audio Player UI: Play button + Progress line + Time */}
      <div className="flex flex-col gap-2 bg-[#F8FAF8] border border-[#E0E7DE] rounded-xl p-3">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button with calm subtle green accent */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'रोकें' : 'सुनें'}
            className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 tap-active shadow-xs hover:bg-[#256829] transition-colors"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Progress Bar with Draggable/Scrub Mock Knob */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className="relative w-full h-2 bg-[#E2E8DF] rounded-full cursor-pointer py-1"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = Math.round((clickX / rect.width) * 100);
                setProgress(Math.max(0, Math.min(100, newPct)));
              }}
            >
              <div
                className="h-2 bg-[#2E7D32] rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                {/* Progress Knob */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-[#2E7D32] rounded-full shadow-xs" />
              </div>
            </div>

            {/* Time Indicators */}
            <div className="flex items-center justify-between text-[11px] font-mono font-medium text-[#5C6773] mt-1.5">
              <span>{isPlaying ? currentTime : '00:00'}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Share Action */}
      <div className="flex items-center justify-between pt-1 border-t border-[#E8E5DF]/50 mt-auto">
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors py-1 tap-active"
          >
            पूरा संदेश सुनें →
          </button>
        ) : (
          <span className="text-[12px] text-[#5C6773]">
            {isPlaying ? 'ध्वनि बज रही है...' : 'सुनने के लिए प्ले बटन दबाएँ'}
          </span>
        )}
        <ShareButton title={title} />
      </div>
    </ContentCard>
  );
};
