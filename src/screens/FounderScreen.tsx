import React from 'react';
import { User, Quote, Sparkles, BookOpen } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton } from '../components';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

interface FounderScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const FounderScreen: React.FC<FounderScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t, language } = useApp();
  const { data } = useData();

  const founder = data?.founder;

  // Determine founder name according to language and CMS settings
  let founderName = language === 'en' ? 'Amar Lal Choudhari' : 'अमर लाल चौधरी';
  if (founder?.name && founder.name.trim() !== '' && founder.name !== 'संस्थापक का नाम') {
    if (language === 'en') {
      founderName = (founder as any).nameEn || (founder.name === 'अमर लाल चौधरी' ? 'Amar Lal Choudhari' : founder.name);
    } else {
      founderName = founder.name === 'Amar Lal Choudhari' ? 'अमर लाल चौधरी' : founder.name;
    }
  }

  // Determine founder role according to language and CMS settings
  let founderRole = language === 'en' ? 'Founder • Ahimsa Shiksha Mission' : 'संस्थापक • अहिंसा शिक्षा मिशन';
  if (founder?.role && founder.role.trim() !== '') {
    if (language === 'en') {
      founderRole = (founder as any).roleEn || (founder.role === 'संस्थापक • अहिंसा शिक्षा मिशन' ? 'Founder • Ahimsa Shiksha Mission' : founder.role);
    } else {
      founderRole = founder.role === 'Founder • Ahimsa Shiksha Mission' ? 'संस्थापक • अहिंसा शिक्षा मिशन' : founder.role;
    }
  }

  const bioText = founder?.bio || founder?.bioText || t.founderBioPlaceholder;
  const messageText = founder?.message || founder?.messageText || t.founderMessagePlaceholder;
  const photoUrl = founder?.photoUrl;

  return (
    <PageContainer>
      {/* Back Button */}
      <div className="pt-1 pb-2">
        <BackButton onBack={onBack || (() => onNavigate('/settings'))} label={t.back} />
      </div>

      {/* Screen Title */}
      <SectionHeading
        title={t.founderHeading}
        subtitle={t.founderSubheading}
        level={1}
        className="mb-4"
      />

      <div className="flex flex-col gap-5">
        {/* Founder Profile Card */}
        <div className="w-full bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs flex flex-col items-center text-center transition-colors">
          {/* Photo Frame / Avatar Placeholder */}
          <div className="relative mb-3.5">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={founderName}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#16325C]/20 dark:border-[#3B82F6]/30 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#FAF8F5] dark:bg-[#0F172A] border-2 border-[#16325C]/20 dark:border-[#3B82F6]/30 flex items-center justify-center text-[#16325C] dark:text-[#93C5FD] shadow-inner">
                <User size={48} strokeWidth={1.4} className="text-[#5C6773] dark:text-[#94A3B8]" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#16325C] dark:bg-[#3B82F6] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={14} />
            </div>
          </div>

          <h2 className="text-[20px] font-bold text-[#0F172A] dark:text-white tracking-tight mb-1">
            {founderName}
          </h2>
          <span className="text-[13px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-[#0F172A] px-3.5 py-1 rounded-full border border-[#16325C]/10 dark:border-[#3B82F6]/30">
            {founderRole}
          </span>
        </div>

        {/* Biography Section */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4.5 shadow-2xs transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7.5 h-7.5 rounded-lg bg-[#EEF3FA] dark:bg-[#0F172A] text-[#16325C] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
              <BookOpen size={16} strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F2342] dark:text-white">
              {t.founderBioTitle}
            </h3>
          </div>
          <p className="text-[14.5px] text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed whitespace-pre-line font-normal">
            {bioText}
          </p>
        </div>

        {/* Founder's Message Card - High Contrast Light & Dark Themes */}
        <div className="bg-[#EEF3FA] dark:bg-[#1E293B] border border-[#B8D0EC] dark:border-[#3B82F6]/40 rounded-2xl p-5 shadow-2xs relative transition-colors">
          <Quote
            size={36}
            className="text-[#16325C]/20 dark:text-[#60A5FA]/25 absolute top-3.5 right-3.5 pointer-events-none"
          />
          <h3 className="text-[14px] font-bold text-[#0F2342] dark:text-[#60A5FA] mb-2 uppercase tracking-wide">
            {t.founderMessageTitle}
          </h3>
          <blockquote className="text-[15.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed italic whitespace-pre-line">
            {messageText}
          </blockquote>
        </div>
      </div>
    </PageContainer>
  );
};
