import React, { useState } from 'react';
import { Phone, Mail, MapPin, Check, Copy, Clock, Info } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

interface ContactScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();
  const { data } = useData();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactData = {
    email: data?.contact?.email || 'amarsiwan1975@gmail.com',
    address: data?.contact?.address || 'नरहट, सिवान, बिहार',
    officeHours: data?.contact?.officeHours || 'प्रातः ९:०० से सायं ६:०० बजे तक',
    guidance: data?.contact?.guidance || '',
    note: data?.contact?.note || '',
  };

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <PageContainer>
      {/* Back Button */}
      <div className="pt-1 pb-2">
        <BackButton onBack={onBack || (() => onNavigate('/settings'))} label={t.back} />
      </div>

      {/* Screen Title */}
      <SectionHeading
        title={t.contactHeading}
        subtitle={t.contactSubheading}
        level={1}
        className="mb-4"
      />

      <div className="flex flex-col gap-4">
        {/* Email Contact Card */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] dark:bg-[#0F172A] text-[#16325C] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
                <Mail size={19} strokeWidth={2} />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#5C6773] dark:text-[#94A3B8] uppercase tracking-wider block">
                  {t.emailLabel}
                </span>
                <span className="text-[15px] font-semibold text-[#1F2421] dark:text-white font-mono">
                  {contactData.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('email', contactData.email)}
              className="p-2 text-[#5C6773] dark:text-[#94A3B8] hover:text-[#16325C] dark:hover:text-white rounded-lg hover:bg-[#EEF3FA] dark:hover:bg-[#0F172A] transition-colors tap-active"
              title="Copy"
            >
              {copiedField === 'email' ? (
                <Check size={16} className="text-[#2E7D32] dark:text-emerald-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E5DF]/60 dark:border-[#334155]">
            <a
              href={`mailto:${contactData.email}`}
              className="w-full min-h-[44px] bg-[#EEF3FA] dark:bg-[#0F172A] text-[#16325C] dark:text-[#93C5FD] border border-[#16325C]/20 dark:border-[#3B82F6]/30 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-[#E2ECF8] dark:hover:bg-[#1E293B] tap-active"
            >
              <Mail size={16} />
              <span>{t.emailButton}</span>
            </a>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] dark:bg-[#062C1B] text-[#2E7D32] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={19} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[12px] font-semibold text-[#5C6773] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                {t.addressLabel}
              </span>
              <p className="text-[14px] text-[#1F2421] dark:text-white leading-relaxed">
                {contactData.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

