import React from 'react';
import { Globe, Youtube, Users, BookOpen, ExternalLink, Facebook } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { LinksEmptyState } from '../components/ui/States';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

interface LinksScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const LinksScreen: React.FC<LinksScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();
  const { getPublishedLinks } = useData();
  const dynamicLinks = getPublishedLinks();

  const getCategoryIcon = (category?: string, title?: string) => {
    const isFacebook = category === 'facebook' || title?.toLowerCase().includes('facebook');
    const isYoutube = category === 'youtube' || title?.toLowerCase().includes('youtube');

    if (isFacebook) {
      return { icon: Facebook, color: 'text-[#1877F2] dark:text-[#60A5FA]', bg: 'bg-[#E7F3FF] dark:bg-[#1E3A8A]/40' };
    }
    if (isYoutube) {
      return { icon: Youtube, color: 'text-[#DC2626] dark:text-[#F87171]', bg: 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/40' };
    }
    if (category === 'social') {
      return { icon: Users, color: 'text-[#2E7D32] dark:text-[#4ADE80]', bg: 'bg-[#F0FDF4] dark:bg-[#064E3B]/40' };
    }
    if (category === 'resource') {
      return { icon: BookOpen, color: 'text-[#D97706] dark:text-[#FBBF24]', bg: 'bg-[#FEF8EC] dark:bg-[#78350F]/40' };
    }
    return { icon: Globe, color: 'text-[#16325C] dark:text-[#93C5FD]', bg: 'bg-[#EEF3FA] dark:bg-[#0F172A]' };
  };

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

      {/* Links List */}
      {dynamicLinks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {dynamicLinks.map((link) => {
            const { icon: Icon, color, bg } = getCategoryIcon(link.category, link.title);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4 shadow-2xs hover:border-[#16325C]/30 dark:hover:border-[#93C5FD]/30 hover:shadow-xs transition-all flex items-center justify-between group tap-active"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white group-hover:text-[#16325C] dark:group-hover:text-[#93C5FD] transition-colors leading-tight mb-0.5">
                      {link.title}
                    </h3>
                    {link.description ? (
                      <p className="text-[12px] text-[#5C6773] dark:text-gray-400 truncate">
                        {link.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8C96A3] dark:text-gray-400 group-hover:text-[#16325C] dark:group-hover:text-[#93C5FD] group-hover:bg-[#EEF3FA] dark:group-hover:bg-[#0F172A] shrink-0 transition-colors">
                  <ExternalLink size={16} />
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="my-2">
          <LinksEmptyState
            title={t.emptyLinksTitle}
            description={t.emptyLinksDesc}
            actionText={t.back}
            onAction={onBack || (() => onNavigate('/settings'))}
          />
        </div>
      )}
    </PageContainer>
  );
};

