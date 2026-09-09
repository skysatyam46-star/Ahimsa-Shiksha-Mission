import React from 'react';
import {
  PageContainer,
  MessageCard,
  VideoCard,
  AudioCard,
  PhotoCard,
  DocumentCard,
  NoticeCard,
  HomeEmptyState,
  Footer,
} from '../components';
import {
  Search,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

interface HomeScreenProps {
  onNavigateToTab: (tabId: 'vichar' | 'video' | 'samagri' | 'khoj') => void;
  onNavigateToRoute?: (path: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onNavigateToRoute,
}) => {
  const { t } = useApp();
  const {
    getPublishedVichar,
    getPublishedVideos,
    getPublishedAudio,
    getPublishedPhotos,
    getPublishedDocuments,
    getPublishedNotices,
  } = useData();

  const navigate = (path: string, fallbackTab: 'vichar' | 'video' | 'samagri' | 'khoj') => {
    if (onNavigateToRoute) {
      onNavigateToRoute(path);
    } else {
      onNavigateToTab(fallbackTab);
    }
  };

  // Aggregate all published items in chronological order (newest first)
  const allPublishedItems = React.useMemo(() => {
    const list: Array<{
      id: string;
      itemType: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice';
      date: string;
      createdAt: string;
      raw: any;
    }> = [];

    getPublishedVichar().forEach((v) =>
      list.push({ id: v.id, itemType: 'vichar', date: v.date, createdAt: v.createdAt, raw: v })
    );
    getPublishedVideos().forEach((v) =>
      list.push({ id: v.id, itemType: 'video', date: v.date, createdAt: v.createdAt, raw: v })
    );
    getPublishedAudio().forEach((a) =>
      list.push({ id: a.id, itemType: 'audio', date: a.date, createdAt: a.createdAt, raw: a })
    );
    getPublishedPhotos().forEach((p) =>
      list.push({ id: p.id, itemType: 'photo', date: p.date, createdAt: p.createdAt, raw: p })
    );
    getPublishedDocuments().forEach((d) =>
      list.push({ id: d.id, itemType: 'document', date: d.date, createdAt: d.createdAt, raw: d })
    );
    getPublishedNotices().forEach((n) =>
      list.push({ id: n.id, itemType: 'notice', date: n.date, createdAt: n.createdAt, raw: n })
    );

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [
    getPublishedVichar,
    getPublishedVideos,
    getPublishedAudio,
    getPublishedPhotos,
    getPublishedDocuments,
    getPublishedNotices,
  ]);

  const hasContent = allPublishedItems.length > 0;

  return (
    <PageContainer>
      {/* Welcome Section: Compact peaceful greeting */}
      <section
        id="welcome-section"
        className="pt-0.5 pb-2.5 flex flex-col gap-0.5 border-b border-[#E8E5DF]/70 mb-3.5"
      >
        <h2 className="text-[19px] sm:text-[21px] font-bold text-[#16325C] tracking-tight leading-snug">
          {t.welcomeTitle}
        </h2>
        <p className="text-[12px] font-semibold text-[#2E7D32] tracking-wide">
          {t.brandTagline}
        </p>
        <p className="text-[13.5px] text-[#5C6773] leading-relaxed mt-0">
          {t.welcomeSubtitle}
        </p>
      </section>

      {/* Search Shortcut */}
      <div
        id="home-search-shortcut"
        role="button"
        tabIndex={0}
        onClick={() => onNavigateToTab('khoj')}
        aria-label="खोजें: विचार, वीडियो और सामग्री"
        className="w-full h-[44px] bg-white border border-[#E8E5DF] rounded-[12px] px-3.5 flex items-center gap-2.5 text-[#5C6773] text-[14px] cursor-pointer hover:border-[#16325C]/30 hover:bg-[#FAF8F5]/60 transition-colors shadow-2xs tap-active mb-4"
      >
        <Search size={16} className="text-[#5C6773] shrink-0" />
        <span className="truncate text-[13.5px]">
          {t.searchPlaceholder}
        </span>
      </div>

      {/* Main Feed Heading */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h3 className="text-[16px] font-bold text-[#16325C] tracking-tight">
          {t.newestFirst}
        </h3>
        <button
          type="button"
          onClick={() => onNavigateToTab('vichar')}
          className="text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] flex items-center gap-1 transition-colors tap-active"
        >
          <span>{t.viewAll}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Feed Content or Production Empty State */}
      {hasContent ? (
        <div className="flex flex-col gap-3.5">
          {allPublishedItems.map((feedItem) => {
            const { itemType, raw } = feedItem;

            if (itemType === 'vichar') {
              return (
                <MessageCard
                  key={`vichar-${raw.id}`}
                  typeLabel={raw.typeLabel || '📝 संदेश'}
                  title={raw.title}
                  date={raw.date}
                  content={raw.leadParagraph || (raw.paragraphs && raw.paragraphs[0]) || ''}
                  author={raw.author}
                  source={raw.source}
                  onReadMore={() => navigate(`/vichar/${raw.id}`, 'vichar')}
                />
              );
            }

            if (itemType === 'video') {
              return (
                <VideoCard
                  key={`video-${raw.id}`}
                  typeLabel={raw.typeLabel || '🎥 वीडियो'}
                  title={raw.title}
                  date={raw.date}
                  duration={raw.duration}
                  speaker={raw.speaker}
                  thumbnailUrl={raw.thumbnailUrl}
                  onClick={() => navigate(`/video/${raw.id}`, 'video')}
                />
              );
            }

            if (itemType === 'audio') {
              return (
                <AudioCard
                  key={`audio-${raw.id}`}
                  typeLabel={raw.typeLabel || '🎧 ऑडियो संदेश'}
                  title={raw.title}
                  date={raw.date}
                  speaker={raw.speaker}
                  duration={raw.duration}
                  currentTime={raw.currentTime || '००:००'}
                  progressPercent={0}
                  onOpen={() => navigate(`/audio/${raw.id}`, 'samagri')}
                />
              );
            }

            if (itemType === 'photo') {
              return (
                <PhotoCard
                  key={`photo-${raw.id}`}
                  typeLabel={raw.typeLabel || '🖼️ फोटो'}
                  title={raw.title}
                  date={raw.date}
                  caption={raw.caption}
                  imageUrl={raw.imageUrl}
                  onViewPhoto={() => navigate(`/photo/${raw.id}`, 'samagri')}
                />
              );
            }

            if (itemType === 'document') {
              return (
                <DocumentCard
                  key={`doc-${raw.id}`}
                  typeLabel={raw.typeLabel || '📄 दस्तावेज'}
                  title={raw.title}
                  description={raw.description}
                  date={raw.date}
                  fileType={raw.fileType || 'PDF'}
                  fileSize={raw.fileSize || ''}
                  pages={raw.pages || ''}
                  onRead={() => navigate(`/document/${raw.id}`, 'samagri')}
                  onDownload={() => navigate(`/document/${raw.id}`, 'samagri')}
                />
              );
            }

            if (itemType === 'notice') {
              return (
                <NoticeCard
                  key={`notice-${raw.id}`}
                  typeLabel={raw.typeLabel || '📢 सूचना'}
                  title={raw.title}
                  date={raw.date}
                  message={raw.content}
                  actionText="पूरी सूचना →"
                  onAction={() => navigate(`/notice/${raw.id}`, 'samagri')}
                  variant={raw.variant || 'blue'}
                />
              );
            }

            return null;
          })}
        </div>
      ) : (
        <div className="py-1 mb-3.5">
          <HomeEmptyState
            title={t.emptyHomeTitle}
            description={t.emptyHomeDesc}
            actionText={t.emptyHomeAction}
            onAction={() => onNavigateToTab('samagri')}
            compact={true}
          />
        </div>
      )}

      {/* Minimal Footer */}
      <Footer />
    </PageContainer>
  );
};
