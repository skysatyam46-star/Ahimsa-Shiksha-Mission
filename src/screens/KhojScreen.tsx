import React, { useState, useMemo } from 'react';
import {
  PageContainer,
  SectionHeading,
  SearchField,
  SearchResultCard,
  SearchEmptyState,
} from '../components';
import { useData } from '../context/DataContext';
import { useApp } from '../context/AppContext';

interface KhojScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

interface SearchResultItem {
  id: string;
  type: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice';
  typeLabel: string;
  title: string;
  excerpt: string;
  date: string;
  route: string;
  keywords: string[];
}

const suggestions = ['अहिंसा', 'शिक्षा', 'सत्य', 'मानवता', 'शांति', 'विचार'];

export const KhojScreen: React.FC<KhojScreenProps> = ({ onNavigateToDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useApp();
  const {
    getPublishedVichar,
    getPublishedVideos,
    getPublishedAudio,
    getPublishedPhotos,
    getPublishedDocuments,
    getPublishedNotices,
  } = useData();

  const trimmedQuery = searchTerm.trim().toLowerCase();

  const dataset: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // Vichar
    getPublishedVichar().forEach((v) => {
      items.push({
        id: v.id,
        type: 'vichar',
        typeLabel: v.typeLabel || '📝 विचार',
        title: v.title,
        excerpt: v.leadParagraph || (v.paragraphs && v.paragraphs[0]) || v.title,
        date: v.date,
        route: `/vichar/${v.id}`,
        keywords: [v.title, v.author, v.topic, ...(v.paragraphs || [])],
      });
    });

    // Videos
    getPublishedVideos().forEach((v) => {
      items.push({
        id: v.id,
        type: 'video',
        typeLabel: v.typeLabel || '🎥 वीडियो',
        title: v.title,
        excerpt: v.description,
        date: v.date,
        route: `/video/${v.id}`,
        keywords: [v.title, v.speaker, ...(v.topics || [])],
      });
    });

    // Audios
    getPublishedAudio().forEach((a) => {
      items.push({
        id: a.id,
        type: 'audio',
        typeLabel: a.typeLabel || '🎧 ऑडियो',
        title: a.title,
        excerpt: a.description,
        date: a.date,
        route: `/audio/${a.id}`,
        keywords: [a.title, a.speaker, a.description, ...(a.topics || [])],
      });
    });

    // Photos
    getPublishedPhotos().forEach((p) => {
      items.push({
        id: p.id,
        type: 'photo',
        typeLabel: p.typeLabel || '🖼️ फोटो',
        title: p.title,
        excerpt: p.caption,
        date: p.date,
        route: `/photo/${p.id}`,
        keywords: [p.title, p.caption, p.description || '', p.location || ''],
      });
    });

    // Documents
    getPublishedDocuments().forEach((d) => {
      items.push({
        id: d.id,
        type: 'document',
        typeLabel: d.typeLabel || '📄 दस्तावेज',
        title: d.title,
        excerpt: d.description,
        date: d.date,
        route: `/document/${d.id}`,
        keywords: [d.title, d.description, d.summary || '', d.fileType || ''],
      });
    });

    // Notices
    getPublishedNotices().forEach((n) => {
      items.push({
        id: n.id,
        type: 'notice',
        typeLabel: n.typeLabel || '📢 सूचना',
        title: n.title,
        excerpt: n.content,
        date: n.date,
        route: `/notice/${n.id}`,
        keywords: [
          n.title,
          n.content,
          n.details?.subject || '',
          n.details?.venue || '',
          n.contactInfo || '',
        ],
      });
    });

    return items;
  }, [
    getPublishedVichar,
    getPublishedVideos,
    getPublishedAudio,
    getPublishedPhotos,
    getPublishedDocuments,
    getPublishedNotices,
  ]);

  // Filter dataset based on query
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return dataset.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.excerpt.toLowerCase().includes(trimmedQuery) ||
        item.typeLabel.toLowerCase().includes(trimmedQuery) ||
        item.keywords.some((k) => k && k.toLowerCase().includes(trimmedQuery))
    );
  }, [trimmedQuery, dataset]);

  const hasSearched = trimmedQuery.length > 0;

  return (
    <PageContainer>
      {/* 1. Header */}
      <SectionHeading
        title={t.khojTitle}
        subtitle={t.khojSubtitle}
        level={1}
        className="mb-3"
      />

      {/* 2. Compact, Touch-Friendly Search Input */}
      <SearchField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t.searchPlaceholder}
        onClear={() => setSearchTerm('')}
        className="mb-3"
      />

      {/* 3. Initial Search State */}
      {!hasSearched && (
        <div className="bg-white border border-[#E8E5DF] rounded-2xl py-3 px-3.5 my-0.5 flex flex-col gap-2.5">
          <div>
            <h3 className="text-[14.5px] font-semibold text-[#16325C]">
              सुझाए गए विषय
            </h3>
            <p className="text-[12px] text-[#5C6773] mt-0.5 leading-normal">
              सामग्री खोजने हेतु नीचे दिए गए विषयों पर टैप करें:
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchTerm(suggestion)}
                className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl text-[13.5px] font-medium text-[#16325C] hover:bg-[#EEF3FA] hover:border-[#16325C]/30 tap-active transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Search Results State */}
      {hasSearched && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] text-[#5C6773] px-0.5">
            <span className="font-semibold text-[#16325C]">
              परिणाम ({searchResults.length})
            </span>
            <span className="text-[#8C96A3]">
              “{searchTerm}”
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={`${result.type}-${result.id}`}
                  typeLabel={result.typeLabel}
                  title={result.title}
                  excerpt={result.excerpt}
                  date={result.date}
                  onClick={() => onNavigateToDetail?.(result.route)}
                />
              ))}
            </div>
          ) : (
            <SearchEmptyState
              title={t.emptySearchTitle}
              description={t.emptySearchDesc}
              className="my-2"
            />
          )}
        </div>
      )}
    </PageContainer>
  );
};
