import React, { useState, useEffect, useRef } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  AudioCard,
  CardActionRow,
  Divider,
  EmptyState,
} from '../components';
import { Play, Pause, Headphones, Volume2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AudioDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToAudio: (id: string) => void;
}

export const AudioDetailScreen: React.FC<AudioDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToAudio,
}) => {
  const { getAudioById, getPublishedAudio } = useData();
  const audio = getAudioById(id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioNodeRef = useRef<HTMLAudioElement | null>(null);

  // Auto clean up and reset when switching audio IDs
  useEffect(() => {
    if (audioNodeRef.current) {
      audioNodeRef.current.pause();
      audioNodeRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTimeSec(0);
    setDurationSec(0);
    setErrorMsg(null);

    return () => {
      if (audioNodeRef.current) {
        audioNodeRef.current.pause();
        audioNodeRef.current = null;
      }
    };
  }, [id, audio?.audioUrl]);

  if (!audio) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह ऑडियो संदेश उपलब्ध नहीं है या हटा दिया गया है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  const relatedAudios = getPublishedAudio()
    .filter((a) => a.id !== id)
    .slice(0, 3);

  // Time formatting helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle playback
  const togglePlay = () => {
    if (!audio.audioUrl) {
      setErrorMsg('ऑडियो संदेश लिंक उपलब्ध नहीं है।');
      return;
    }

    if (!audioNodeRef.current) {
      const audioNode = new Audio(audio.audioUrl);
      audioNodeRef.current = audioNode;

      audioNode.addEventListener('loadedmetadata', () => {
        setDurationSec(audioNode.duration);
      });
      audioNode.addEventListener('timeupdate', () => {
        setCurrentTimeSec(audioNode.currentTime);
      });
      audioNode.addEventListener('play', () => {
        setIsPlaying(true);
        setErrorMsg(null);
      });
      audioNode.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      audioNode.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTimeSec(0);
      });
      audioNode.addEventListener('error', (errEvent) => {
        console.error('Audio element error:', errEvent);
        setIsPlaying(false);
        setErrorMsg('ऑडियो संदेश चलाने में विफल। लिंक की जांच करें।');
      });
    }

    const audioNode = audioNodeRef.current;
    if (isPlaying) {
      audioNode.pause();
    } else {
      // Cooperative pause
      const stopOthersEvent = new CustomEvent('stopAllAudio', { detail: { id } });
      window.dispatchEvent(stopOthersEvent);

      const playPromise = audioNode.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setErrorMsg(null);
          })
          .catch((err) => {
            console.error('Play promise error:', err);
            setErrorMsg('चलाने में विफल (ब्राउज़र ब्लॉक)। फिर से प्रयास करें।');
            setIsPlaying(false);
          });
      }
    }
  };

  // Scrub progress
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioNodeRef.current) return;
    const targetDuration = durationSec > 0 ? durationSec : audioNodeRef.current.duration;
    if (!targetDuration || isNaN(targetDuration)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = clickPct * targetDuration;

    audioNodeRef.current.currentTime = newTime;
    setCurrentTimeSec(newTime);
  };

  const currentProgressPercent =
    durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  const displayCurrentTime = formatTime(currentTimeSec);
  const displayDuration = durationSec > 0 ? formatTime(durationSec) : audio.duration;

  return (
    <PageContainer>
      {/* 1. Top Navigation */}
      <div className="pt-1 pb-2 flex items-center justify-between">
        <BackButton onBack={onBack} label="वापस" />
      </div>

      {/* 2. Audio Content Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#2E7D32] bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#2E7D32]/20 px-2.5 py-0.5 rounded-md">
            {audio.typeLabel || '🎧 ऑडियो संदेश'}
          </span>
          <DateLabel date={audio.date} />
        </div>

        <h1 className="text-[21px] sm:text-[23px] font-bold text-[#16325C] dark:text-[#93C5FD] leading-snug tracking-tight">
          {audio.title}
        </h1>

        {audio.speaker && (
          <p className="text-[14px] text-[#5C6773] dark:text-gray-400 -mt-1">
            वक्ता: <strong className="text-[#1F2421] dark:text-white font-semibold">{audio.speaker}</strong>
          </p>
        )}

        {/* 3. Controlled Custom Audio Player Canvas */}
        <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-[#E8E5DF] dark:border-slate-700/60 rounded-2xl p-5 shadow-xs flex flex-col gap-4 my-1">
          {/* Audio Visual Header: Sound Wave & Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#16325C] dark:text-[#93C5FD]">
              <div className="w-8 h-8 rounded-full bg-[#EEF3FA] dark:bg-slate-800 flex items-center justify-center text-[#16325C] dark:text-[#93C5FD]">
                <Headphones size={16} />
              </div>
              <span className="text-[13px] font-bold">
                ऑडियो प्लेयर
              </span>
            </div>

            {/* Subtle green active badge */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2E7D32] bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#2E7D32]/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              शान्ति प्रवाह
            </span>
          </div>

          {/* Large play button */}
          <div className="flex items-center justify-center py-1">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'रोकें' : 'सुनें'}
              className="w-14 h-14 rounded-full bg-[#2E7D32] text-white flex items-center justify-center tap-active shadow-md hover:bg-[#256829] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Interactive Progress Scrub Line */}
          <div className="flex flex-col gap-1.5">
            <div
              onClick={handleScrub}
              className="relative w-full h-3 flex items-center cursor-pointer select-none py-1"
            >
              {/* Background Track */}
              <div className="w-full h-1 bg-[#E2E8DF] dark:bg-slate-700 rounded-full relative">
                {/* Active progress */}
                <div
                  className="h-full bg-[#2E7D32] rounded-full relative"
                  style={{ width: `${currentProgressPercent}%` }}
                >
                  {/* Slider Knob */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white border border-[#2E7D32] shadow-sm" />
                </div>
              </div>
            </div>

            {/* Timers */}
            <div className="flex items-center justify-between text-[11.5px] font-mono font-medium text-[#5C6773] dark:text-gray-400">
              <span className="text-[#2E7D32] font-bold">{displayCurrentTime}</span>
              <span>{displayDuration}</span>
            </div>
          </div>

          {/* Volume / listening note */}
          <div className="flex items-center justify-between text-[11.5px] text-[#5C6773] dark:text-gray-400 pt-2 border-t border-[#E8E5DF]/60 dark:border-slate-700/60">
            <span className="flex items-center gap-1.5">
              <Volume2 size={13} className="text-[#5C6773] dark:text-gray-400" />
              {isPlaying ? 'ऑडियो संदेश बज रहा है...' : 'सुनने के लिए प्ले बटन दबाएँ'}
            </span>
            <span className="text-[10.5px] text-[#8C96A3] font-medium">उच्च गुणवत्ता ध्वनि</span>
          </div>

          {errorMsg && (
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 text-center -mt-1">
              {errorMsg}
            </p>
          )}
        </div>

        {/* 4. Description Area */}
        {audio.description && (
          <div className="mt-1 flex flex-col gap-1.5">
            <p className="text-[15px] text-[#1F2421] dark:text-gray-100 leading-relaxed font-medium">
              {audio.description}
            </p>
          </div>
        )}

        {audio.aboutText && (
          <p className="text-[14px] text-[#5C6773] dark:text-gray-300 leading-relaxed bg-[#FAF8F5] dark:bg-slate-800/40 p-3.5 rounded-xl border border-[#E8E5DF] dark:border-slate-700 mt-1">
            {audio.aboutText}
          </p>
        )}

        {/* Share & Like Action Row */}
        <div className="pt-2 border-t border-[#E8E5DF]/60 dark:border-slate-700/60 mt-2">
          <CardActionRow
            contentId={audio.id}
            contentType="audio"
            contentTitle={audio.title}
            title={audio.title}
            text={`🎧 ${audio.title}\n${audio.description || ''}`}
          />
        </div>
      </div>

      {/* 5. Related Audios */}
      <section className="mt-5 mb-6 flex flex-col gap-3">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[16px] font-bold text-[#16325C] dark:text-[#93C5FD] tracking-tight">
            अन्य ऑडियो संदेश
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedAudios.map((rel) => (
            <AudioCard
              key={rel.id}
              id={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              description={rel.description}
              audioUrl={rel.audioUrl}
              date={rel.date}
              speaker={rel.speaker}
              duration={rel.duration}
              onOpen={() => {
                window.scrollTo(0, 0);
                onNavigateToAudio(rel.id);
              }}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
};
