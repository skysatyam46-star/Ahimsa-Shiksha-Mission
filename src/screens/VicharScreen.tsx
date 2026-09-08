import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  MessageCard,
  SearchField,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';

interface VicharScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const VicharScreen: React.FC<VicharScreenProps> = ({ onNavigateToDetail }) => {
  const [search, setSearch] = useState('');
  const { getPublishedVichar } = useData();

  const publishedVicharList = getPublishedVichar();

  // Clean filter by search query
  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return publishedVicharList;
    return publishedVicharList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.leadParagraph && item.leadParagraph.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.topic && item.topic.toLowerCase().includes(q))
    );
  }, [search, publishedVicharList]);

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <SectionHeading
        title="विचार"
        subtitle="अहिंसा, शिक्षा, मानवता और जीवन से जुड़े विचार।"
        level={1}
        className="mb-2"
      />

      {/* 2. Compact Search Field */}
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="🔎 विचार खोजें..."
        className="mb-3"
      />

      {/* 3. Subtle Sort / Count Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {filteredMessages.length} विचार</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. Message List or Empty State */}
      {filteredMessages.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {filteredMessages.map((item) => (
            <MessageCard
              key={item.id}
              typeLabel="📝 संदेश"
              title={item.titleHindi}
              date={item.date}
              content={item.textHindi}
              author={item.author}
              topic={item.topic}
              onReadMore={() => onNavigateToDetail?.(`/vichar/${item.id}`)}
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
            <Search size={20} />
          </div>
          <h3 className="text-[16px] font-semibold text-[#16325C] mb-1">
            अभी कोई विचार उपलब्ध नहीं है।
          </h3>
          <p className="text-[13px] text-[#5C6773] max-w-[260px] leading-relaxed">
            आपके द्वारा खोजे गए शब्द से संबंधित कोई विचार नहीं मिला। कृपया अन्य शब्द का प्रयास करें।
          </p>
        </div>
      )}

      {/* 5. Clean Footer */}
      <Footer />
    </PageContainer>
  );
};
