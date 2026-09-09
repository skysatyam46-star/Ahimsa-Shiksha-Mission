import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  PhotoCard,
  CardActionRow,
  Divider,
  EmptyState,
  ImageZoomModal,
} from '../components';
import { Share2, Check, MapPin, ZoomIn } from 'lucide-react';
import { useData } from '../context/DataContext';

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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { getPhotoById, getPublishedPhotos } = useData();

  const photo = getPhotoById(id);

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

  const relatedPhotos = getPublishedPhotos()
    .filter((p) => p.id !== id)
    .slice(0, 3);

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
        <div
          onClick={() => setIsZoomOpen(true)}
          className="relative w-full aspect-16/11 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E5DF] shadow-sm cursor-pointer group"
          title="फ़ुल-स्क्रीन ज़ूम करने के लिए क्लिक करें"
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-[13.5px] backdrop-blur-[2px]">
            <ZoomIn size={20} />
            <span>बड़ा करके देखें (ज़ूम)</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}
            className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all tap-active"
          >
            <ZoomIn size={14} />
            <span>ज़ूम करें</span>
          </button>
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

        {/* Share & Like Action Row */}
        <div className="pt-3 border-t border-[#E8E5DF] mt-1">
          <CardActionRow
            title={photo.title}
            text={`🖼️ ${photo.title}\n${photo.caption || ''}`}
          />
        </div>
      </div>

      {/* 3. Related Photos: अन्य फोटो */}
      <section className="mt-6 mb-6 flex flex-col gap-3">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[16px] font-bold text-[#16325C] tracking-tight">
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
                window.scrollTo(0, 0);
                onNavigateToPhoto(rel.id);
              }}
            />
          ))}
        </div>
      </section>

      <ImageZoomModal
        isOpen={isZoomOpen}
        imageUrl={photo.imageUrl}
        title={photo.title}
        caption={photo.caption || photo.description}
        onClose={() => setIsZoomOpen(false)}
      />
    </PageContainer>
  );
};

