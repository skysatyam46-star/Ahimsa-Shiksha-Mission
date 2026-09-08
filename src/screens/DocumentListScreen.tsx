import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  BackButton,
  DocumentListItemCard,
  DocumentEmptyState,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';

interface DocumentListScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const DocumentListScreen: React.FC<DocumentListScreenProps> = ({
  onNavigateToDetail,
}) => {
  const { getPublishedDocuments } = useData();
  const documentList = getPublishedDocuments();

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
        title="दस्तावेज"
        subtitle="महत्वपूर्ण PDF और अध्ययन सामग्री"
        level={1}
        className="mb-2"
      />

      {/* 3. Subtle Metadata & Sort Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {documentList.length} दस्तावेज</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. Vertical Document List */}
      {documentList.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {documentList.map((doc) => (
            <DocumentListItemCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              description={doc.description}
              date={doc.date}
              fileType={doc.fileType}
              fileSize={doc.fileSize}
              pages={doc.pages}
              onClick={() => onNavigateToDetail?.(`/document/${doc.id}`)}
            />
          ))}
        </div>
      ) : (
        <DocumentEmptyState
          actionText="सामग्री पर वापस जाएं"
          onAction={() => onNavigateToDetail?.('/samagri')}
        />
      )}

      {/* 5. Peaceful Footer */}
      <Footer className="mt-8" />
    </PageContainer>
  );
};
