import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  VideoCard,
  VideoEmptyState,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';
import { useApp } from '../context/AppContext';

interface VideoScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const VideoScreen: React.FC<VideoScreenProps> = ({ onNavigateToDetail }) => {
  const { getPublishedVideos } = useData();
  const { t } = useApp();
  const publishedVideos = getPublishedVideos();

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <SectionHeading
        title={t.videoTitle}
        subtitle={t.videoSubtitle}
        level={1}
        className="mb-2"
      />

      {/* 2. Visually Subtle Sort Indicator */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>{t.totalCount}: {publishedVideos.length}</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          {t.newestFirst}
        </span>
      </div>

      {/* 3. Video Archive List */}
      {publishedVideos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {publishedVideos.map((video) => (
            <VideoCard
              key={video.id}
              typeLabel={video.typeLabel || '🎥 वीडियो'}
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
        <div className="my-2">
          <VideoEmptyState
            title={t.emptyVideoTitle}
            description={t.emptyVideoDesc}
          />
        </div>
      )}

      {/* 4. Clean Footer */}
      <Footer />
    </PageContainer>
  );
};
