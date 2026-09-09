import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { CardActionRow } from './CardActionRow';

interface AudioCardProps {
  id?: string;
  title: string;
  description?: string;
  speaker?: string;
  duration: string;
  currentTime?: string;
  date?: string;
  category?: string;
  typeLabel?: string;
  progressPercent?: number;
  audioUrl?: string;
  onOpen?: () => void;
  onClick?: () => void;
  className?: string;
}

export const AudioCard: React.FC<AudioCardProps> = ({
  id,
  title,
  description,
  speaker,
  duration = '03:30',
  date,
  category,
  typeLabel = '🎧 ऑडियो संदेश',
  audioUrl,
  onOpen,
  onClick,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleCardOpen = onOpen || onClick;

  // Convert seconds to MM:SS format helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cooperative Pausing: pause when another audio is played
  useEffect(() => {
    const handleStopAll = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.id !== id) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      }
    };
    window.addEventListener('stopAllAudio', handleStopAll);
    return () => {
      window.removeEventListener('stopAllAudio', handleStopAll);
      // Cleanup audio element on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [id]);

  // Audio Playback Toggle
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioUrl) {
      setErrorMsg('ऑडियो संदेश लिंक उपलब्ध नहीं है।');
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Event Listeners for HTMLAudioElement
      audio.addEventListener('loadedmetadata', () => {
        setDurationSec(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTimeSec(audio.currentTime);
      });
      audio.addEventListener('play', () => {
        setIsPlaying(true);
        setErrorMsg(null);
      });
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTimeSec(0);
      });
      audio.addEventListener('error', (errEvent) => {
        console.error('Audio node error:', errEvent);
        setIsPlaying(false);
        setErrorMsg('ऑडियो संदेश चलाने में विफल। लिंक की जांच करें।');
      });
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      // Pause other audio cards cooperating on the page
      const stopOthersEvent = new CustomEvent('stopAllAudio', { detail: { id } });
      window.dispatchEvent(stopOthersEvent);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setErrorMsg(null);
          })
          .catch((err) => {
            console.error('Autoplay restriction or failure:', err);
            setErrorMsg('चलाने में विफल (ब्राउज़र ब्लॉक)। फिर से प्रयास करें।');
            setIsPlaying(false);
          });
      }
    }
  };

  // Seek/Scrub control
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const targetDuration = durationSec > 0 ? durationSec : audioRef.current.duration;
    if (!targetDuration || isNaN(targetDuration)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = clickPct * targetDuration;

    audioRef.current.currentTime = newTime;
    setCurrentTimeSec(newTime);
  };

  const currentProgressPercent =
    durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  const displayCurrentTime = formatTime(currentTimeSec);
  const displayDuration = durationSec > 0 ? formatTime(durationSec) : duration;

  return (
    <ContentCard
      radius="md"
      className={`flex flex-col gap-2.5 p-3.5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700/60 shadow-xs ${className}`}
    >
      {/* 1. Header: Category/Label + Date */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 dark:border-slate-700/40 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-bold text-[#2E7D32] bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#2E7D32]/20 px-2 py-0.5 rounded-md">
            {typeLabel}
          </span>
          {category && (
            <span className="text-[12px] font-medium text-[#5C6773] dark:text-gray-300 bg-[#FAF8F5] dark:bg-slate-700 px-2 py-0.5 rounded-md">
              {category}
            </span>
          )}
        </div>
        {date && <DateLabel date={date} />}
      </div>

      {/* 2. Audio Title & Optional Description (Clamped to 2 lines for compactness) */}
      <div className="space-y-1">
        <h3
          onClick={handleCardOpen}
          className={`text-[15.5px] font-bold text-[#16325C] dark:text-[#93C5FD] leading-snug line-clamp-2 ${
            handleCardOpen ? 'cursor-pointer hover:underline' : ''
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        {speaker && (
          <p className="text-[11.5px] text-[#8C96A3] mt-0.5">
            वक्ता: <span className="font-semibold text-[#5C6773] dark:text-gray-300">{speaker}</span>
          </p>
        )}
      </div>

      {/* 3. Audio Player Inline Bar UI */}
      <div className="flex flex-col gap-1 bg-[#F8FAF8] dark:bg-slate-900/50 border border-[#E0E7DE] dark:border-slate-700 rounded-xl p-2.5">
        <div className="flex items-center gap-3">
          {/* Circular Play Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'रोकें' : 'सुनें'}
            className="w-9 h-9 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm hover:bg-[#256829] active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Time & Elegent Slider Track in single linear line */}
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            {/* Current Time */}
            <span className="text-[11.5px] font-mono font-bold text-[#2E7D32] shrink-0 min-w-[34px]">
              {displayCurrentTime}
            </span>

            {/* Progress Bar Container */}
            <div
              onClick={handleScrub}
              className="flex-1 relative h-4 flex items-center cursor-pointer select-none"
            >
              <div className="w-full h-1 bg-[#E2E8DF] dark:bg-slate-700 rounded-full relative">
                {/* Active progress */}
                <div
                  className="h-full bg-[#2E7D32] rounded-full relative"
                  style={{ width: `${currentProgressPercent}%` }}
                >
                  {/* Handle pointer */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#2E7D32] rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            {/* Duration */}
            <span className="text-[11.5px] font-mono font-medium text-[#5C6773] dark:text-gray-400 shrink-0 min-w-[34px] text-right">
              {displayDuration}
            </span>
          </div>
        </div>

        {/* Dynamic Errors Container */}
        {errorMsg && (
          <p className="text-[10.5px] font-medium text-amber-600 dark:text-amber-400 mt-1 px-1">
            {errorMsg}
          </p>
        )}
      </div>

      {/* 4. Action Row */}
      <CardActionRow
        contentId={id}
        contentType="audio"
        contentTitle={title}
        title={title}
        text={title}
        onReadMore={handleCardOpen}
        readMoreText="सुनें →"
      />
    </ContentCard>
  );
};
