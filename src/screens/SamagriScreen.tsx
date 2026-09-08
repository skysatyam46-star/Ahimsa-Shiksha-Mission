import React from 'react';
import { Headphones, Image as ImageIcon, FileText, Bell, ExternalLink, ArrowRight } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  ContentCategoryCard,
  Footer,
} from '../components';
import { useData } from '../context/DataContext';

interface SamagriScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

export const SamagriScreen: React.FC<SamagriScreenProps> = ({ onNavigateToDetail }) => {
  const {
    getPublishedAudio,
    getPublishedPhotos,
    getPublishedDocuments,
    getPublishedNotices,
    getPublishedLinks,
  } = useData();

  const audios = getPublishedAudio();
  const photos = getPublishedPhotos();
  const documents = getPublishedDocuments();
  const notices = getPublishedNotices();
  const links = getPublishedLinks();

  const categories = [
    {
      id: 'audio',
      icon: <Headphones size={20} strokeWidth={2} />,
      title: 'ऑडियो संदेश',
      description: 'विचार और संदेश सुनें',
      count: `${audios.length} ऑडियो संदेश`,
      route: '/audio',
    },
    {
      id: 'photo',
      icon: <ImageIcon size={20} strokeWidth={2} />,
      title: 'फोटो',
      description: 'मिशन से जुड़ी तस्वीरें देखें',
      count: `${photos.length} फोटो`,
      route: '/photo',
    },
    {
      id: 'document',
      icon: <FileText size={20} strokeWidth={2} />,
      title: 'दस्तावेज',
      description: 'महत्वपूर्ण PDF और अध्ययन सामग्री',
      count: `${documents.length} दस्तावेज`,
      route: '/document',
    },
    {
      id: 'notice',
      icon: <Bell size={20} strokeWidth={2} />,
      title: 'सूचनाएँ',
      description: 'मिशन की महत्वपूर्ण घोषणाएँ और अपडेट',
      count: `${notices.length} सूचनाएँ`,
      route: '/notice',
    },
    {
      id: 'links',
      icon: <ExternalLink size={20} strokeWidth={2} />,
      title: 'महत्वपूर्ण लिंक',
      description: 'मिशन से जुड़े उपयोगी ऑनलाइन स्रोत',
      count: `${links.length} लिंक`,
      route: '/links',
    },
  ];

  // Pick recent items across published categories
  const recentItems = [
    audios[0] && {
      id: `audio-${audios[0].id}`,
      typeLabel: '🎧 ऑडियो संदेश',
      title: audios[0].title,
      date: audios[0].date,
      route: `/audio/${audios[0].id}`,
    },
    documents[0] && {
      id: `doc-${documents[0].id}`,
      typeLabel: '📄 दस्तावेज',
      title: documents[0].title,
      date: documents[0].date,
      route: `/document/${documents[0].id}`,
    },
    photos[0] && {
      id: `photo-${photos[0].id}`,
      typeLabel: '🖼️ फोटो',
      title: photos[0].title,
      date: photos[0].date,
      route: `/photo/${photos[0].id}`,
    },
  ].filter(Boolean) as {
    id: string;
    typeLabel: string;
    title: string;
    date: string;
    route: string;
  }[];

  const handleCategoryClick = (route: string) => {
    onNavigateToDetail?.(route);
  };

  return (
    <PageContainer>
      {/* 1. Header */}
      <SectionHeading
        title="सामग्री"
        subtitle="विचार, ऑडियो, फोटो, दस्तावेज और सूचनाएँ"
        level={1}
        className="mb-4"
      />

      {/* 2. Content Category List */}
      <div className="flex flex-col gap-3.5">
        {categories.map((cat) => (
          <ContentCategoryCard
            key={cat.id}
            icon={cat.icon}
            title={cat.title}
            description={cat.description}
            count={cat.count}
            actionText="देखें"
            onClick={() => handleCategoryClick(cat.route)}
          />
        ))}
      </div>

      {/* 3. Small Section: हाल की सामग्री */}
      {recentItems.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="text-[16px] font-semibold text-[#16325C]">
              हाल की सामग्री
            </h2>
            <span className="text-[12px] text-[#5C6773]">नवीनतम जोड़</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigateToDetail?.(item.route)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigateToDetail?.(item.route);
                  }
                }}
                className="w-full bg-white border border-[#E8E5DF] rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-[#16325C]/25 hover:shadow-2xs transition-all tap-active cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
                      {item.typeLabel}
                    </span>
                    <span className="text-[11px] text-[#5C6773]">{item.date}</span>
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#16325C] truncate group-hover:underline decoration-[#16325C]/30 leading-snug">
                    {item.title}
                  </h4>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E5DF] flex items-center justify-center shrink-0 text-[#16325C] group-hover:bg-[#EEF3FA] transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Minimal Footer */}
      <Footer />
    </PageContainer>
  );
};
