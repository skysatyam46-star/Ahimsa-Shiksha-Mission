import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  PhotoCard,
  Divider,
  Footer,
  EmptyState,
} from '../components';
import { Share2, Check, MapPin } from 'lucide-react';
import { mockPhotos } from '../data/mockContent';

interface PhotoDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToPhoto: (id: string) => void;
}

export const PhotoDetailScreen: React.FC<PhotoDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToPhoto,
}) => {
  const [copied, setCopied] = useState(false);

  const photo = mockPhotos[id];

  if (!photo) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह फोटो उपलब्ध नहीं है या हटा दी गई है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  const relatedPhotos = Object.values(mockPhotos).filter((p) => p.id !== id).slice(0, 3);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `🖼️ ${photo.title}\n${photo.caption}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
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

      {/* 2. Photo Content Area */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2.5 py-0.5 rounded-md">
            {photo.typeLabel}
          </span>
          <DateLabel date={photo.date} />
        </div>

        {/* Large Immersive Photo View */}
        <div className="relative w-full aspect-16/11 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E5DF] shadow-sm">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Date */}
        <div className="flex flex-col gap-1 mt-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] leading-snug tracking-tight">
            {photo.title}
          </h1>

          {photo.location && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#5C6773]">
              <MapPin size={13} className="text-[#2E7D32]" />
              <span>{photo.location}</span>
            </div>
          )}
        </div>

        {/* Caption and Full Description */}
        <div className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
          <p className="font-medium text-[#16325C] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E5DF]">
            {photo.description}
          </p>

          <p className="text-[#1F2421]">
            {photo.caption}
          </p>
        </div>

        {/* Share Action */}
        <div className="pt-3 pb-2 border-t border-[#E8E5DF] mt-2 flex items-center justify-between">
          <span className="text-[14px] text-[#5C6773]">
            यह फोटो साझा करें
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

      {/* 3. Related Photos: अन्य फोटो */}
      <section className="mt-6 mb-6 flex flex-col gap-3.5">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[17px] font-bold text-[#16325C] tracking-tight">
            अन्य फोटो
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedPhotos.map((rel) => (
            <PhotoCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              date={rel.date}
              caption={rel.caption}
              imageUrl={rel.imageUrl}
              onViewPhoto={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToPhoto(rel.id);
              }}
            />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
