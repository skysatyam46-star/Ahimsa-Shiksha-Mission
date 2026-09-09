import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  MessageCard,
  SearchField,
  VicharEmptyState,
  SearchEmptyState,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';
import { useApp } from '../context/AppContext';

interface VicharScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const VicharScreen: React.FC<VicharScreenProps> = ({ onNavigateToDetail }) => {
  const [search, setSearch] = useState('');
  const { getPublishedVichar } = useData();
  const { t } = useApp();

  const publishedVicharList = getPublishedVichar();

  // Clean filter by search query
  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return publishedVicharList;
    return publishedVicharList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        ((item as any).titleHindi && (item as any).titleHindi.toLowerCase().includes(q)) ||
        (item.leadParagraph && item.leadParagraph.toLowerCase().includes(q)) ||
        ((item as any).textHindi && (item as any).textHindi.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.topic && item.topic.toLowerCase().includes(q))
    );
  }, [search, publishedVicharList]);

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <SectionHeading
        title={t.vicharTitle}
        subtitle={t.vicharSubtitle}
        level={1}
        className="mb-2"
      />

      {/* 2. Compact Search Field */}
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder={t.searchPlaceholder}
        className="mb-3"
      />

      {/* 3. Subtle Sort / Count Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>{t.totalCount}: {filteredMessages.length}</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          {t.newestFirst}
        </span>
      </div>

      {/* 4. Message List or Empty State */}
      {filteredMessages.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {filteredMessages.map((item) => (
            <MessageCard
              key={item.id}
              id={item.id}
              typeLabel={item.typeLabel || '📝 संदेश'}
              title={item.title || (item as any).titleHindi}
              date={item.date}
              content={item.leadParagraph || (item as any).textHindi || (item.paragraphs && item.paragraphs[0]) || ''}
              author={item.author}
              topic={item.topic}
              source={item.source}
              onReadMore={() => onNavigateToDetail?.(`/vichar/${item.id}`)}
            />
          ))}
        </div>
      ) : search.trim() ? (
        <div className="my-2">
          <SearchEmptyState
            title={t.emptySearchTitle}
            description={t.emptySearchDesc}
          />
        </div>
      ) : (
        <div className="my-2">
          <VicharEmptyState
            title={t.emptyVicharTitle}
            description={t.emptyVicharDesc}
          />
        </div>
      )}

      {/* 5. Clean Footer */}
      <Footer />
    </PageContainer>
  );
};
