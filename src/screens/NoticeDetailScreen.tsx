import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  NoticeCard,
  Divider,
  Footer,
  EmptyState,
} from '../components';
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Share2,
  Check,
  Info,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface NoticeDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToNotice: (id: string) => void;
}

export const NoticeDetailScreen: React.FC<NoticeDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToNotice,
}) => {
  const [copied, setCopied] = useState(false);
  const { getNoticeById, getPublishedNotices } = useData();

  const notice = getNoticeById(id);

  if (!notice) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह सूचना उपलब्ध नहीं है या हटा दी गई है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  const relatedNotices = getPublishedNotices()
    .filter((n) => n.id !== id)
    .slice(0, 3);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `📢 ${notice.title}\n${notice.content}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: notice.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // noop
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // noop
      }
    }
  };

  return (
    <PageContainer>
      {/* 1. Top Navigation */}
      <div className="pt-1 pb-2 flex items-center justify-between">
        <BackButton onBack={onBack} label="वापस" />
      </div>

      {/* 2. Notice Content Area (Calm, informational, NOT emergency) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
            <Bell size={13} className="text-[#16325C]" />
            <span>{notice.typeLabel}</span>
          </span>
          <DateLabel date={notice.date} />
        </div>

        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] leading-snug tracking-tight">
          {notice.title}
        </h1>

        {/* Lead message in clean calm panel */}
        <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-4 flex flex-col gap-2 shadow-2xs">
          <p className="text-[15px] text-[#1F2421] leading-relaxed">
            {notice.content}
          </p>
        </div>

        {/* Program / Event Schedule Details */}
        {notice.details && (
          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 flex flex-col gap-3 shadow-2xs">
            <h2 className="text-[15px] font-bold text-[#16325C] tracking-tight pb-2 border-b border-[#E8E5DF]/70">
              कार्यक्रम विवरण
            </h2>

            <div className="flex flex-col gap-2.5 text-[14px]">
              <div className="flex items-start gap-2.5">
                <Calendar size={16} className="text-[#2E7D32] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5C6773]">दिनांक</span>
                  <span className="font-semibold text-[#1F2421]">{notice.details.eventDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-[#16325C] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5C6773]">समय</span>
                  <span className="font-semibold text-[#1F2421]">{notice.details.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#B45309] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5C6773]">स्थान</span>
                  <span className="font-semibold text-[#1F2421]">{notice.details.venue}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText size={16} className="text-[#16325C] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5C6773]">मुख्य विषय</span>
                  <span className="font-semibold text-[#1F2421]">{notice.details.subject}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guidelines / Directions */}
        {notice.guidelines && notice.guidelines.length > 0 && (
          <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-4 flex flex-col gap-2">
            <span className="text-[14px] font-semibold text-[#16325C] flex items-center gap-1.5">
              <Info size={15} className="text-[#2E7D32]" />
              <span>सहभागिता निर्देश:</span>
            </span>
            <ul className="flex flex-col gap-1.5 text-[14px] text-[#5C6773]">
              {notice.guidelines.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact note */}
        {notice.contactInfo && (
          <p className="text-[13px] text-[#5C6773] italic px-1">
            {notice.contactInfo}
          </p>
        )}

        {/* Share Action */}
        <div className="pt-3 pb-2 border-t border-[#E8E5DF] mt-2 flex items-center justify-between">
          <span className="text-[14px] text-[#5C6773]">
            यह सूचना साझा करें
          </span>

          <button
            type="button"
            onClick={handleShare}
            aria-label="साझा करें"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-medium transition-colors tap-active min-h-[44px] shadow-2xs ${
              copied
                ? 'bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20'
                : 'bg-white text-[#16325C] hover:bg-[#FAF8F5] border border-[#E8E5DF]'
            }`}
          >
            {copied ? <Check size={16} className="text-[#2E7D32]" /> : <Share2 size={15} />}
            <span>{copied ? 'कॉपी हो गया' : '↗ साझा करें'}</span>
          </button>
        </div>
      </div>

      {/* 3. Related Notices: अन्य सूचनाएँ */}
      <section className="mt-6 mb-6 flex flex-col gap-3.5">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[17px] font-bold text-[#16325C] tracking-tight">
            अन्य सूचनाएँ
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedNotices.map((rel) => (
            <NoticeCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              date={rel.date}
              message={rel.content.slice(0, 100) + '...'}
              actionText="पूरी सूचना →"
              onAction={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToNotice(rel.id);
              }}
              variant="blue"
            />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
