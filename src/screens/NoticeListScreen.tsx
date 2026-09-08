import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  BackButton,
  NoticeCard,
  NoticeEmptyState,
  Footer,
} from '../components';
import { mockNotices } from '../data/mockContent';

interface NoticeListScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const NoticeListScreen: React.FC<NoticeListScreenProps> = ({
  onNavigateToDetail,
}) => {
  // Ordered notice items (newest first)
  const noticeList = Object.values(mockNotices);

  return (
    <PageContainer>
      {/* 1. Back Navigation Action */}
      <div className="pt-1 pb-2">
        <BackButton
          onBack={() => onNavigateToDetail?.('/samagri')}
          label="सामग्री"
        />
      </div>

      {/* 2. Page Header */}
      <SectionHeading
        title="सूचनाएँ"
        subtitle="मिशन की महत्वपूर्ण घोषणाएँ और अपडेट"
        level={1}
        className="mb-2"
      />

      {/* 3. Subtle Metadata & Sort Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {noticeList.length} सूचनाएँ</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. Notice Content List */}
      {noticeList.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {noticeList.map((notice) => (
            <NoticeCard
              key={notice.id}
              typeLabel={notice.typeLabel}
              title={notice.title}
              message={notice.content}
              date={notice.date}
              variant={notice.variant || 'blue'}
              actionText="पूरी सूचना →"
              onClick={() => onNavigateToDetail?.(`/notice/${notice.id}`)}
            />
          ))}
        </div>
      ) : (
        <NoticeEmptyState
          actionText="सामग्री पर वापस जाएं"
          onAction={() => onNavigateToDetail?.('/samagri')}
        />
      )}

      {/* 5. Peaceful Footer */}
      <Footer className="mt-8" />
    </PageContainer>
  );
};
