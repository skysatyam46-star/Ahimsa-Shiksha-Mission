import React from 'react';
import {
  Sun,
  Moon,
  Globe,
  Compass,
  User,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp, Language, Theme } from '../context/AppContext';

interface SettingsScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { language, theme, setLanguage, setTheme, t } = useApp();

  return (
    <PageContainer>
      {/* 1. Back Navigation */}
      <div className="pt-1 pb-2">
        <BackButton onBack={onBack || (() => onNavigate('/'))} label={t.back} />
      </div>

      {/* 2. Screen Header */}
      <SectionHeading
        title={t.settingsHeaderTitle}
        subtitle={t.settingsSubtitle}
        level={1}
        className="mb-4"
      />

      <div className="flex flex-col gap-6">
        {/* ==================================================
            SECTION 1: APPEARANCE (THEME)
            ================================================== */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-[#5C6773] uppercase tracking-wider px-1">
            {t.appearanceSection}
          </span>

          <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 px-0.5">
              <span className="text-[15px] font-medium text-[#1F2421]">
                {t.themeLabel}
              </span>
              <span className="text-[12px] text-[#5C6773]">
                {theme === 'light' ? t.themeLight : t.themeDark}
              </span>
            </div>

            {/* Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-[14px] font-medium transition-all tap-active ${
                  theme === 'light'
                    ? 'bg-white text-[#16325C] shadow-xs font-semibold'
                    : 'text-[#5C6773] hover:text-[#1F2421]'
                }`}
              >
                <Sun size={17} strokeWidth={theme === 'light' ? 2.2 : 1.8} />
                <span>{t.themeLight}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-[14px] font-medium transition-all tap-active ${
                  theme === 'dark'
                    ? 'bg-[#1E2D44] text-[#93C5FD] shadow-xs font-semibold'
                    : 'text-[#5C6773] hover:text-[#1F2421]'
                }`}
              >
                <Moon size={17} strokeWidth={theme === 'dark' ? 2.2 : 1.8} />
                <span>{t.themeDark}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            SECTION 2: LANGUAGE (BHASHA)
            ================================================== */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-semibold text-[#5C6773] uppercase tracking-wider">
              {t.languageSection}
            </span>
            <span className="text-[11px] font-mono text-[#16325C] font-semibold bg-[#EEF3FA] px-2 py-0.5 rounded-full border border-[#16325C]/10">
              {language === 'hinglish' ? 'Hinglish (Default)' : language === 'hi' ? 'हिन्दी' : 'English'}
            </span>
          </div>

          <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-3 shadow-2xs divide-y divide-[#E8E5DF]/60">
            {/* Hinglish Option */}
            <button
              type="button"
              onClick={() => setLanguage('hinglish')}
              className={`w-full min-h-[50px] px-2 py-2 flex items-center justify-between rounded-xl transition-colors tap-active ${
                language === 'hinglish' ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold ${
                    language === 'hinglish'
                      ? 'bg-[#16325C] text-white'
                      : 'bg-[#EEF3FA] text-[#16325C]'
                  }`}
                >
                  Aa
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-semibold text-[#1F2421]">
                      Hinglish
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-tight bg-[#2E7D32]/10 text-[#2E7D32] px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                  <span className="text-[12px] text-[#5C6773]">
                    Natural Roman Hindi
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  language === 'hinglish'
                    ? 'border-[#16325C] bg-[#16325C]'
                    : 'border-[#CBD5E1]'
                }`}
              >
                {language === 'hinglish' && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* Hindi Option */}
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`w-full min-h-[50px] px-2 py-2 flex items-center justify-between rounded-xl transition-colors tap-active ${
                language === 'hi' ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold ${
                    language === 'hi'
                      ? 'bg-[#16325C] text-white'
                      : 'bg-[#EEF3FA] text-[#16325C]'
                  }`}
                >
                  अ
                </div>
                <div className="text-left">
                  <span className="text-[15px] font-semibold text-[#1F2421] block">
                    हिन्दी
                  </span>
                  <span className="text-[12px] text-[#5C6773]">
                    देवनागरी लिपि
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  language === 'hi'
                    ? 'border-[#16325C] bg-[#16325C]'
                    : 'border-[#CBD5E1]'
                }`}
              >
                {language === 'hi' && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* English Option */}
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`w-full min-h-[50px] px-2 py-2 flex items-center justify-between rounded-xl transition-colors tap-active ${
                language === 'en' ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold ${
                    language === 'en'
                      ? 'bg-[#16325C] text-white'
                      : 'bg-[#EEF3FA] text-[#16325C]'
                  }`}
                >
                  EN
                </div>
                <div className="text-left">
                  <span className="text-[15px] font-semibold text-[#1F2421] block">
                    English
                  </span>
                  <span className="text-[12px] text-[#5C6773]">
                    English interface
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  language === 'en'
                    ? 'border-[#16325C] bg-[#16325C]'
                    : 'border-[#CBD5E1]'
                }`}
              >
                {language === 'en' && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>

          {/* Language note explaining content stays untouched */}
          <div className="flex items-start gap-2 px-1 text-[12px] text-[#5C6773] leading-relaxed">
            <Info size={14} className="shrink-0 text-[#16325C] mt-0.5" />
            <span>{t.languageNote}</span>
          </div>
        </div>

        {/* ==================================================
            SECTION 3: INFORMATION & PAGES
            ================================================== */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-[#5C6773] uppercase tracking-wider px-1">
            {t.infoSection}
          </span>

          <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs divide-y divide-[#E8E5DF]/60">
            {/* 1. Mission */}
            <button
              type="button"
              onClick={() => onNavigate('/mission')}
              className="w-full min-h-[52px] p-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors group tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10">
                  <Compass size={18} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors">
                    {t.missionTitle}
                  </h4>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    {t.missionDesc}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-[#8C96A3] group-hover:text-[#16325C] shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </button>

            {/* 2. Founder */}
            <button
              type="button"
              onClick={() => onNavigate('/founder')}
              className="w-full min-h-[52px] p-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors group tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10">
                  <User size={18} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors">
                    {t.founderTitle}
                  </h4>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    {t.founderDesc}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-[#8C96A3] group-hover:text-[#16325C] shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </button>

            {/* 3. Contact */}
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="w-full min-h-[52px] p-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors group tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10">
                  <PhoneCall size={18} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors">
                    {t.contactTitle}
                  </h4>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    {t.contactDesc}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-[#8C96A3] group-hover:text-[#16325C] shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </button>

            {/* 4. Important Links */}
            <button
              type="button"
              onClick={() => onNavigate('/links')}
              className="w-full min-h-[52px] p-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors group tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10">
                  <ExternalLink size={18} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors">
                    {t.linksTitle}
                  </h4>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    {t.linksDesc}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-[#8C96A3] group-hover:text-[#16325C] shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* ==================================================
            SECTION 3: ADMINISTRATION (SUBTLE ENTRY)
            ================================================== */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-[#5C6773] uppercase tracking-wider px-1">
            प्रशासन (Administration)
          </span>

          <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => onNavigate('/admin/login')}
              className="w-full min-h-[52px] p-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors group tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10">
                  <ShieldCheck size={18} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors">
                    Admin Login
                  </h4>
                  <p className="text-[12px] text-[#5C6773] truncate">
                    Mission website manage karne ke liye
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#16325C]">
                <span className="text-[13px] font-semibold hidden xs:inline">Login →</span>
                <ChevronRight
                  size={18}
                  className="text-[#8C96A3] group-hover:text-[#16325C] shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-10" />
    </PageContainer>
  );
};
