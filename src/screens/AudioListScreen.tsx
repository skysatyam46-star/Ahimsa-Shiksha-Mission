import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  BackButton,
  AudioListItemCard,
  AudioEmptyState,
  Footer,
} from '../components';
import { mockAudios } from '../data/mockContent';

interface AudioListScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const AudioListScreen: React.FC<AudioListScreenProps> = ({
  onNavigateToDetail,
}) => {
  // Ordered audio items (newest first)
  const audioList = Object.values(mockAudios);

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
        title="ऑडियो संदेश"
        subtitle="विचार और संदेश सुनें"
        level={1}
        className="mb-2"
      />

      {/* 3. Subtle Metadata & Sort Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {audioList.length} ऑडियो संदेश</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. Audio Content List */}
      {audioList.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {audioList.map((audio) => (
            <AudioListItemCard
              key={audio.id}
              id={audio.id}
              title={audio.title}
              description={audio.description}
              date={audio.date}
              duration={audio.duration}
              speaker={audio.speaker}
              onClick={() => onNavigateToDetail?.(`/audio/${audio.id}`)}
            />
          ))}
        </div>
      ) : (
        <AudioEmptyState
          actionText="सामग्री पर वापस जाएं"
          onAction={() => onNavigateToDetail?.('/samagri')}
        />
      )}

      {/* 5. Peaceful Footer */}
      <Footer className="mt-8" />
    </PageContainer>
  );
};
