import React from 'react';
import { ArrowUpDown, Video } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  VideoCard,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';

interface VideoScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const VideoScreen: React.FC<VideoScreenProps> = ({ onNavigateToDetail }) => {
  const { getPublishedVideos } = useData();
  const publishedVideos = getPublishedVideos();

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <SectionHeading
        title="वीडियो"
        subtitle="अहिंसा, शिक्षा और मानवता से जुड़े वीडियो।"
        level={1}
        className="mb-2"
      />

      {/* 2. Visually Subtle Sort Indicator */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {publishedVideos.length} वीडियो</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 3. Video Archive List */}
      {publishedVideos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {publishedVideos.map((video) => (
            <VideoCard
              key={video.id}
              typeLabel="🎥 वीडियो"
              title={video.title}
              duration={video.duration}
              date={video.date}
              speaker={video.speaker}
              description={video.description}
              thumbnailUrl={video.thumbnailUrl}
              thumbnailFirst={true}
              onClick={() => onNavigateToDetail?.(`/video/${video.id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State Component */
        <div
          role="status"
          className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-[#E8E5DF] my-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center mb-3">
            <Video size={20} />
          </div>
          <h3 className="text-[16px] font-semibold text-[#16325C] mb-1">
            अभी कोई वीडियो उपलब्ध नहीं है।
          </h3>
          <p className="text-[13px] text-[#5C6773] max-w-[260px] leading-relaxed">
            जल्द ही नए प्रेरणादायी वीडियो यहाँ जोड़े जाएँगे।
          </p>
        </div>
      )}

      {/* 4. Clean Footer */}
      <Footer />
    </PageContainer>
  );
};
