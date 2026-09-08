import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  VideoCard,
  Divider,
  Footer,
  EmptyState,
} from '../components';
import { Play, Share2, Check } from 'lucide-react';
import { mockVideos } from '../data/mockContent';

interface VideoDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToVideo: (id: string) => void;
}

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToVideo,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSimulatedPlayNotice, setShowSimulatedPlayNotice] = useState(false);

  const video = mockVideos[id];

  if (!video) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह वीडियो उपलब्ध नहीं है या हटा दिया गया है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  const relatedVideos = Object.values(mockVideos).filter((v) => v.id !== id).slice(0, 3);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `🎥 ${video.title}\n${video.description}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
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

      {/* 2. Video Player Area (16:9 Placeholder) */}
      <div className="flex flex-col gap-3">
        {/* Top Type & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2.5 py-0.5 rounded-md">
            {video.typeLabel}
          </span>
          <DateLabel date={video.date} />
        </div>

        {/* 16:9 Future YouTube Player Canvas */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowSimulatedPlayNotice(true)}
          aria-label={`वीडियो चलाएं: ${video.title}`}
          className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-[#16325C] border border-[#16325C]/20 shadow-md group cursor-pointer flex items-center justify-center"
        >
          {/* Background thumbnail image */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-300"
          />

          {/* Dark scrim gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/30 pointer-events-none" />

          {/* Center Big Play Button (16:9 Placeholder aesthetic) */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-white/95 text-[#16325C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Play size={28} fill="currentColor" className="ml-1 text-[#16325C]" />
          </div>

          {/* Duration Badge Bottom Right */}
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 text-white font-mono text-[12px] font-medium rounded-md backdrop-blur-xs">
            {video.duration}
          </span>

          {/* Future YouTube Placeholder Watermark */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 text-white/90 text-[11px] font-medium rounded-md backdrop-blur-xs">
            वीडियो प्लेयर
          </span>
        </div>

        {/* Simulated notice banner on tap */}
        {showSimulatedPlayNotice && (
          <div className="bg-[#EEF3FA] border border-[#16325C]/15 rounded-xl p-3 text-[13px] text-[#16325C] flex items-center justify-between">
            <span>प्रोटोटाइप संस्करण — वास्तविक वीडियो यूट्यूब द्वारा शीघ्र उपलब्ध होगा।</span>
            <button
              type="button"
              onClick={() => setShowSimulatedPlayNotice(false)}
              className="text-[12px] font-bold underline ml-2"
            >
              ठीक है
            </button>
          </div>
        )}

        {/* Title & Metadata */}
        <div className="flex flex-col gap-1 mt-1">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#16325C] leading-snug tracking-tight">
            {video.title}
          </h1>

          {video.speaker && (
            <p className="text-[14px] text-[#5C6773]">
              वक्ता: <strong className="text-[#1F2421] font-semibold">{video.speaker}</strong>
            </p>
          )}
        </div>

        {/* Short Description */}
        <p className="text-[15px] text-[#1F2421] leading-relaxed">
          {video.description}
        </p>

        {/* Talking points / outline */}
        {video.topics && video.topics.length > 0 && (
          <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-3.5 flex flex-col gap-2 mt-1">
            <span className="text-[13px] font-semibold text-[#16325C]">
              प्रमुख विचार बिंदु:
            </span>
            <ul className="flex flex-col gap-1.5 text-[14px] text-[#5C6773]">
              {video.topics.map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share Action Button */}
        <div className="pt-3 pb-2 border-t border-[#E8E5DF] mt-2 flex items-center justify-between">
          <span className="text-[14px] text-[#5C6773]">
            यह वीडियो साझा करें
          </span>

          <button
            type="button"
            onClick={handleShare}
            aria-label="साझा करें"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-medium transition-colors tap-active min-h-[44px] shadow-2xs ${
              copied
                ? 'bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20'
                : 'bg-white text-[#16325C] hover:bg-[#FAF8F5] border border-[#E8E5DF]'
            }`}
          >
            {copied ? <Check size={16} className="text-[#2E7D32]" /> : <Share2 size={15} />}
            <span>{copied ? 'कॉपी हो गया' : '↗ साझा करें'}</span>
          </button>
        </div>
      </div>

      {/* 3. Related Videos: अन्य वीडियो */}
      <section className="mt-6 mb-6 flex flex-col gap-3.5">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[17px] font-bold text-[#16325C] tracking-tight">
            अन्य वीडियो
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedVideos.map((rel) => (
            <VideoCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              date={rel.date}
              duration={rel.duration}
              speaker={rel.speaker}
              thumbnailUrl={rel.thumbnailUrl}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToVideo(rel.id);
              }}
            />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
