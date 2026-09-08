import React from 'react';
import { ArrowUpDown, Video } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  VideoCard,
  Footer,
} from '../components';
import {
  peacefulSunThumbnail,
  satyagrahaThumbnail,
  peacefulAshramPhoto,
  workshopPhoto,
} from '../data/homeFeed';
import {
  studentDialoguePhoto,
  prayerGatheringPhoto,
} from '../data/mockContent';

interface VideoScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

interface VideoItem {
  id: string;
  typeLabel: string;
  title: string;
  date: string;
  duration: string;
  speaker: string;
  description: string;
  thumbnailUrl: string;
}

const mockVideoArchive: VideoItem[] = [
  {
    id: '1',
    typeLabel: '🎥 वीडियो',
    title: 'अहिंसा और मानवता पर विचार',
    date: '6 सितंबर 2026',
    duration: '१४:२०',
    speaker: 'आचार्य विद्यानंद',
    description:
      'इस वीडियो में अहिंसा, मानवता और हमारे दैनिक जीवन में सकारात्मक सोच के महत्व पर विचार प्रस्तुत किए गए हैं।',
    thumbnailUrl: peacefulSunThumbnail,
  },
  {
    id: '4',
    typeLabel: '🎥 वीडियो',
    title: 'अहिंसा और शिक्षा',
    date: '3 सितंबर 2026',
    duration: '१६:१०',
    speaker: 'प्रो. शांति स्वरूप',
    description:
      'शिक्षा प्रणाली में अहिंसक मूल्यों, मानवीय संवेदनाओं और चरित्र निर्माण के समावेश पर विशेष परिचर्चा।',
    thumbnailUrl: studentDialoguePhoto,
  },
  {
    id: '5',
    typeLabel: '🎥 वीडियो',
    title: 'मानवता और हमारा समाज',
    date: '30 अगस्त 2026',
    duration: '१५:३०',
    speaker: 'डॉ. अनुराधा जोशी',
    description:
      'सामूहिक सद्भाव, आपसी सहयोग और समरस समाज के निर्माण के व्यावहारिक उपाय एवं चिंतन।',
    thumbnailUrl: workshopPhoto,
  },
  {
    id: '2',
    typeLabel: '🎥 वीडियो',
    title: 'गांधी जी और अहिंसात्मक सत्याग्रह',
    date: '27 अगस्त 2026',
    duration: '१८:४५',
    speaker: 'डॉ. रवींद्र कुमार',
    description:
      'महात्मा गांधी के सत्याग्रह और अहिंसक संघर्ष के ऐतिहासिक सिद्धांतों की वर्तमान परिप्रेक्ष्य में समीक्षा।',
    thumbnailUrl: satyagrahaThumbnail,
  },
  {
    id: '3',
    typeLabel: '🎥 वीडियो',
    title: 'शांति और जीवन मूल्य',
    date: '24 अगस्त 2026',
    duration: '१२:१५',
    speaker: 'प्रो. हरिश्चंद्र',
    description:
      'व्यक्तिगत जीवन में शांति, मानसिक संतुलन और मानवीय मूल्यों के समन्वय पर एक प्रेरणादायी संवाद।',
    thumbnailUrl: peacefulAshramPhoto,
  },
  {
    id: '6',
    typeLabel: '🎥 वीडियो',
    title: 'युवा संवाद: राष्ट्र निर्माण और सद्भाव',
    date: '19 अगस्त 2026',
    duration: '२०:०५',
    speaker: 'आचार्य विद्यानंद',
    description:
      'युवाओं में नैतिक साहस, सत्य के प्रति निष्ठा और निस्वार्थ समाज सेवा की चेतना जागृत करने पर विशेष संवाद।',
    thumbnailUrl: prayerGatheringPhoto,
  },
];

export const VideoScreen: React.FC<VideoScreenProps> = ({ onNavigateToDetail }) => {
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
        <span>कुल {mockVideoArchive.length} वीडियो</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 3. Video Archive List */}
      {mockVideoArchive.length > 0 ? (
        <div className="flex flex-col gap-4">
          {mockVideoArchive.map((video) => (
            <VideoCard
              key={video.id}
              typeLabel={video.typeLabel}
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
