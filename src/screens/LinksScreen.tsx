import React from 'react';
import { Globe, Youtube, Users, BookOpen, ExternalLink, Info } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp } from '../context/AppContext';

interface LinksScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const LinksScreen: React.FC<LinksScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();

  const links = [
    {
      id: 'website',
      title: t.officialWebsite,
      desc: t.officialWebsiteDesc,
      url: 'https://example.org',
      icon: Globe,
      color: 'text-[#16325C]',
      bg: 'bg-[#EEF3FA]',
    },
    {
      id: 'youtube',
      title: t.youtubeChannel,
      desc: t.youtubeChannelDesc,
      url: 'https://youtube.com',
      icon: Youtube,
      color: 'text-[#DC2626]',
      bg: 'bg-[#FEF2F2]',
    },
    {
      id: 'community',
      title: t.socialCommunity,
      desc: t.socialCommunityDesc,
      url: 'https://example.org/community',
      icon: Users,
      color: 'text-[#2E7D32]',
      bg: 'bg-[#F0FDF4]',
    },
    {
      id: 'resources',
      title: t.studyResources,
      desc: t.studyResourcesDesc,
      url: 'https://example.org/resources',
      icon: BookOpen,
      color: 'text-[#D97706]',
      bg: 'bg-[#FEF8EC]',
    },
  ];

  return (
    <PageContainer>
      {/* Back Button */}
      <div className="pt-1 pb-2">
        <BackButton onBack={onBack || (() => onNavigate('/settings'))} label={t.back} />
      </div>

      {/* Screen Title */}
      <SectionHeading
        title={t.linksHeading}
        subtitle={t.linksSubheading}
        level={1}
        className="mb-4"
      />

      {/* Placeholder note */}
      <div className="w-full bg-[#FEF8EC] border border-[#D97706]/20 rounded-2xl p-3 mb-5 flex items-start gap-2.5">
        <Info size={16} className="text-[#D97706] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#8C5D07] leading-relaxed">
          यह स्थानधारक (placeholder) लिंक सूची है। मिशन के आधिकारिक लिंक उपलब्ध होने पर इन्हें जोड़ा जाएगा।
        </p>
      </div>

      {/* Links List */}
      <div className="flex flex-col gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs hover:border-[#16325C]/30 hover:shadow-xs transition-all flex items-center justify-between group tap-active"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-xl ${link.bg} ${link.color} flex items-center justify-center shrink-0`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-[#1F2421] group-hover:text-[#16325C] transition-colors leading-tight mb-0.5">
                    {link.title}
                  </h3>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    {link.desc}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8C96A3] group-hover:text-[#16325C] group-hover:bg-[#EEF3FA] shrink-0 transition-colors">
                <ExternalLink size={16} />
              </div>
            </a>
          );
        })}
      </div>

      <Footer className="mt-10" />
    </PageContainer>
  );
};
