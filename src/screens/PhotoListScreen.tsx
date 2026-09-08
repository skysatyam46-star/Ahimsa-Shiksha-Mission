import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  BackButton,
  PhotoGridCard,
  PhotoEmptyState,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';

interface PhotoListScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const PhotoListScreen: React.FC<PhotoListScreenProps> = ({
  onNavigateToDetail,
}) => {
  const { getPublishedPhotos } = useData();
  const photoList = getPublishedPhotos();

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
        title="फोटो"
        subtitle="अहिंसा शिक्षा मिशन की गतिविधियों और कार्यक्रमों की झलकियाँ"
        level={1}
        className="mb-2"
      />

      {/* 3. Subtle Metadata & Sort Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {photoList.length} फोटो</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. 2-Column Photo Grid */}
      {photoList.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {photoList.map((photo) => (
            <PhotoGridCard
              key={photo.id}
              id={photo.id}
              title={photo.title}
              date={photo.date}
              imageUrl={photo.imageUrl}
              caption={photo.caption}
              onClick={() => onNavigateToDetail?.(`/photo/${photo.id}`)}
            />
          ))}
        </div>
      ) : (
        <PhotoEmptyState
          actionText="सामग्री पर वापस जाएं"
          onAction={() => onNavigateToDetail?.('/samagri')}
        />
      )}

      {/* 5. Peaceful Footer */}
      <Footer className="mt-8" />
    </PageContainer>
  );
};
