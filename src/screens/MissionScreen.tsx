import React from 'react';
import { Heart, Sparkles, BookOpen, Users, Compass, ShieldCheck } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

interface MissionScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();
  const { data } = useData();

  const mission = data?.mission;
  const objectiveText = mission?.objective || mission?.objectiveText || t.ourObjectiveText;
  const philosophyText = mission?.philosophy || mission?.philosophyText || t.ourPhilosophyText;
  const effortText = mission?.effort || mission?.effortText || t.ourEffortText;

  const pillars = [
    {
      title: 'सत्य',
      subtitle: 'Truth',
      desc: 'विचार, वाणी और आचरण में सच्चाई की दृढ़ता',
      icon: Sparkles,
      color: 'text-[#D97706]',
      bg: 'bg-[#FEF8EC]',
    },
    {
      title: 'अहिंसा',
      subtitle: 'Non-Violence',
      desc: 'प्राणी मात्र के प्रति करुणा और द्वेषरहित दृष्टि',
      icon: Heart,
      color: 'text-[#2E7D32]',
      bg: 'bg-[#F0FDF4]',
    },
    {
      title: 'शिक्षा',
      subtitle: 'Education',
      desc: 'नैतिक मूल्य, सद्विचार और आत्मनिर्भरता का विकास',
      icon: BookOpen,
      color: 'text-[#16325C]',
      bg: 'bg-[#EEF3FA]',
    },
    {
      title: 'मानवता',
      subtitle: 'Humanity',
      desc: 'सद्भाव, सेवा और समतामूलक समाज की भावना',
      icon: Users,
      color: 'text-[#254B85]',
      bg: 'bg-[#EEF3FA]',
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
        title={t.missionHeading}
        subtitle={t.missionSubheading}
        level={1}
        className="mb-5"
      />

      <div className="flex flex-col gap-6">
        {/* Core Pillars 2x2 Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-[#5C6773] uppercase tracking-wider px-1">
            {t.corePillarsTitle}
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E8E5DF] rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-medium text-[#8C96A3]">
                      {pillar.subtitle}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1F2421] mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-[11.5px] text-[#5C6773] leading-snug">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Hamara Uddeshya */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EEF3FA] text-[#16325C] flex items-center justify-center">
              <Compass size={16} strokeWidth={2} />
            </div>
            <h2 className="text-[16px] font-bold text-[#16325C]">
              {t.ourObjectiveTitle}
            </h2>
          </div>
          <p className="text-[14px] text-[#1F2421] leading-relaxed whitespace-pre-line">
            {objectiveText}
          </p>
        </div>

        {/* Section: Hamare Vichar */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center">
              <Heart size={16} strokeWidth={2} />
            </div>
            <h2 className="text-[16px] font-bold text-[#16325C]">
              {t.ourPhilosophyTitle}
            </h2>
          </div>
          <p className="text-[14px] text-[#1F2421] leading-relaxed whitespace-pre-line">
            {philosophyText}
          </p>
        </div>

        {/* Section: Hamara Prayas */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FEF8EC] text-[#D97706] flex items-center justify-center">
              <ShieldCheck size={16} strokeWidth={2} />
            </div>
            <h2 className="text-[16px] font-bold text-[#16325C]">
              {t.ourEffortTitle}
            </h2>
          </div>
          <p className="text-[14px] text-[#1F2421] leading-relaxed whitespace-pre-line">
            {effortText}
          </p>
        </div>
      </div>

      <Footer className="mt-10" />
    </PageContainer>
  );
};
