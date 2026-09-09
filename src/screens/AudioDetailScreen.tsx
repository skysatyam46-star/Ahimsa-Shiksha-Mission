import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  AudioCard,
  CardActionRow,
  Divider,
  EmptyState,
} from '../components';
import { Play, Pause, Share2, Check, Headphones, Volume2 } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  const [copied, setCopied] = useState(false);
  const { getAudioById, getPublishedAudio } = useData();

  const audio = getAudioById(id);

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

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `🎧 ${audio.title}\n${audio.description}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: audio.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // noop
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // noop
      }
    }
  };

  return (
    <PageContainer>
      {/* 1. Top Navigation */}
      <div className="pt-1 pb-2 flex items-center justify-between">
        <BackButton onBack={onBack} label="वापस" />
      </div>

      {/* 2. Audio Content Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-2.5 py-0.5 rounded-md">
            {audio.typeLabel}
          </span>
          <DateLabel date={audio.date} />
        </div>

        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] leading-snug tracking-tight">
          {audio.title}
        </h1>

        {audio.speaker && (
          <p className="text-[14px] text-[#5C6773] -mt-1">
            वक्ता: <strong className="text-[#1F2421] font-semibold">{audio.speaker}</strong>
          </p>
        )}

        {/* 3. Large Elegant Audio Player Canvas */}
        <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-5 shadow-xs flex flex-col gap-4 my-1">
          {/* Audio Visual Header: Sound Wave & Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#16325C]">
              <div className="w-8 h-8 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#16325C]">
                <Headphones size={16} />
              </div>
              <span className="text-[13px] font-medium text-[#16325C]">
                ध्वनि संदेश
              </span>
            </div>

            {/* Subtle green active badge */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              शान्ति प्रवाह
            </span>
          </div>

          {/* Center Large Play / Pause Button with Blue Primary & Subtle Green Accent */}
          <div className="flex items-center justify-center py-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'रोकें' : 'सुनें'}
              className="w-16 h-16 rounded-full bg-[#16325C] text-white flex items-center justify-center tap-active shadow-md hover:bg-[#0F2342] transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Interactive Progress Scrub Line: ━━━━━━○━━━━━━ */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div
              className="relative w-full h-3 flex items-center cursor-pointer select-none py-1"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = Math.round((clickX / rect.width) * 100);
                setProgress(Math.max(0, Math.min(100, newPct)));
              }}
            >
              {/* Background Track */}
              <div className="w-full h-2 bg-[#E2E8DF] rounded-full overflow-hidden">
                {/* Active Progress Bar with subtle green touch on blue */}
                <div
                  className="h-full bg-linear-to-r from-[#16325C] to-[#2E7D32] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Slider Thumb Knob ○ */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#16325C] shadow-sm transition-all"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Timers: 00:00          02:35 */}
            <div className="flex items-center justify-between text-[12px] font-mono font-medium text-[#5C6773]">
              <span>{isPlaying ? '01:14' : '00:00'}</span>
              <span>{audio.duration}</span>
            </div>
          </div>

          {/* Subtle volume / listening note */}
          <div className="flex items-center justify-between text-[12px] text-[#5C6773] pt-1 border-t border-[#E8E5DF]/70">
            <span className="flex items-center gap-1">
              <Volume2 size={14} className="text-[#5C6773]" />
              {isPlaying ? 'ऑडियो बज रहा है...' : 'सुनने के लिए प्ले बटन दबाएँ'}
            </span>
            <span className="text-[11px] text-[#8C96A3]">उच्च गुणवत्ता ध्वनि</span>
          </div>
        </div>

        {/* 4. Description Area */}
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-[16px] font-bold text-[#16325C]">
            संदेश के बारे में
          </h2>

          <p className="text-[15px] text-[#1F2421] leading-relaxed">
            {audio.description}
          </p>

          <p className="text-[14px] text-[#5C6773] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E5DF]">
            {audio.aboutText}
          </p>
        </div>

        {/* Share & Like Action Row */}
        <div className="pt-3 border-t border-[#E8E5DF] mt-1">
          <CardActionRow
            title={audio.title}
            text={`🎧 ${audio.title}\n${audio.description || ''}`}
          />
        </div>
      </div>

      {/* 5. Related Audios: अन्य ऑडियो संदेश */}
      <section className="mt-6 mb-6 flex flex-col gap-3">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[16px] font-bold text-[#16325C] tracking-tight">
            अन्य ऑडियो संदेश
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedAudios.map((rel) => (
            <AudioCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
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

