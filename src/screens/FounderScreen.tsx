import React from 'react';
import { User, Quote, Sparkles, Info, BookOpen } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp } from '../context/AppContext';

interface FounderScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const FounderScreen: React.FC<FounderScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();

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

      {/* Notice regarding placeholder information */}
      <div className="w-full bg-[#FEF8EC] border border-[#D97706]/20 rounded-2xl p-3 mb-5 flex items-start gap-2.5">
        <Info size={16} className="text-[#D97706] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#8C5D07] leading-relaxed">
          {t.placeholderNotice}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Founder Card with Avatar & Name */}
        <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-5 shadow-2xs flex flex-col items-center text-center">
          {/* Photo Placeholder Frame */}
          <div className="relative mb-3.5">
            <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#16325C]/20 flex items-center justify-center text-[#16325C] shadow-inner">
              <User size={48} strokeWidth={1.4} className="text-[#5C6773]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#16325C] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={14} />
            </div>
          </div>

          <h2 className="text-[19px] font-bold text-[#1F2421] tracking-tight mb-0.5">
            {t.founderName}
          </h2>
          <span className="text-[12.5px] font-medium text-[#5C6773]">
            संस्थापक • अहिंसा शिक्षा मिशन
          </span>
        </div>

        {/* Short Biography Placeholder */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EEF3FA] text-[#16325C] flex items-center justify-center">
              <BookOpen size={16} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-[#16325C]">
              {t.founderBioTitle}
            </h3>
          </div>
          <p className="text-[14px] text-[#1F2421] leading-relaxed">
            {t.founderBioPlaceholder}
          </p>
        </div>

        {/* Founder's Message / Vichar */}
        <div className="bg-gradient-to-b from-[#EEF3FA] to-[#FAF8F5] border border-[#16325C]/15 rounded-2xl p-4.5 shadow-2xs relative">
          <Quote
            size={32}
            className="text-[#16325C]/15 absolute top-3.5 right-3.5 pointer-events-none"
          />
          <h3 className="text-[14px] font-bold text-[#16325C] mb-2 uppercase tracking-wide">
            {t.founderMessageTitle}
          </h3>
          <blockquote className="text-[15px] font-medium text-[#1F2421] leading-relaxed italic">
            {t.founderMessagePlaceholder}
          </blockquote>
        </div>
      </div>

      <Footer className="mt-10" />
    </PageContainer>
  );
};
