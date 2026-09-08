import React, { useState } from 'react';
import { Phone, Mail, MapPin, Info, Check, Copy } from 'lucide-react';
import { PageContainer, SectionHeading, BackButton, Footer } from '../components';
import { useApp } from '../context/AppContext';

interface ContactScreenProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { t } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const contactData = {
    phone: '+91 XXXXX XXXXX',
    email: 'contact@example.com',
    address: 'अहिंसा भवन, शिक्षा मार्ग, नई दिल्ली - 110001',
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

      {/* Notice regarding mock contact information */}
      <div className="w-full bg-[#FEF8EC] border border-[#D97706]/20 rounded-2xl p-3 mb-5 flex items-start gap-2.5">
        <Info size={16} className="text-[#D97706] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#8C5D07] leading-relaxed">
          {t.mockContactNotice}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Phone Contact Card */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0">
                <Phone size={19} strokeWidth={2} />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#5C6773] uppercase tracking-wider block">
                  {t.phoneLabel}
                </span>
                <span className="text-[15px] font-semibold text-[#1F2421] font-mono">
                  {contactData.phone}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('phone', contactData.phone)}
              className="p-2 text-[#5C6773] hover:text-[#16325C] rounded-lg hover:bg-[#EEF3FA] transition-colors tap-active"
              title="Copy"
            >
              {copiedField === 'phone' ? (
                <Check size={16} className="text-[#2E7D32]" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E5DF]/60">
            <a
              href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full min-h-[44px] bg-[#16325C] text-white rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-[#0F2342] tap-active shadow-xs"
            >
              <Phone size={16} />
              <span>{t.callButton}</span>
            </a>
          </div>
        </div>

        {/* Email Contact Card */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0">
                <Mail size={19} strokeWidth={2} />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#5C6773] uppercase tracking-wider block">
                  {t.emailLabel}
                </span>
                <span className="text-[15px] font-semibold text-[#1F2421] font-mono">
                  {contactData.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('email', contactData.email)}
              className="p-2 text-[#5C6773] hover:text-[#16325C] rounded-lg hover:bg-[#EEF3FA] transition-colors tap-active"
              title="Copy"
            >
              {copiedField === 'email' ? (
                <Check size={16} className="text-[#2E7D32]" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E5DF]/60">
            <a
              href={`mailto:${contactData.email}`}
              className="w-full min-h-[44px] bg-[#EEF3FA] text-[#16325C] border border-[#16325C]/20 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-[#E2ECF8] tap-active"
            >
              <Mail size={16} />
              <span>{t.emailButton}</span>
            </a>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={19} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[12px] font-semibold text-[#5C6773] uppercase tracking-wider block mb-1">
                {t.addressLabel}
              </span>
              <p className="text-[14px] text-[#1F2421] leading-relaxed">
                {contactData.address}
              </p>
              <span className="text-[11px] text-[#8C96A3] mt-1 block">
                (स्थानधारक पता • Sample address)
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer className="mt-10" />
    </PageContainer>
  );
};
