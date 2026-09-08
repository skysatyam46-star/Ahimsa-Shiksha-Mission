import React from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  MessageCard,
  Divider,
  Footer,
  EmptyState,
} from '../components';
import { Share2, Check, Quote } from 'lucide-react';
import { mockMessages } from '../data/mockContent';

interface MessageDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToMessage: (id: string) => void;
}

export const MessageDetailScreen: React.FC<MessageDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToMessage,
}) => {
  const [copied, setCopied] = React.useState(false);

  const message = mockMessages[id];

  if (!message) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह विचार संदेश उपलब्ध नहीं है या हटा दिया गया है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  // Related messages (excluding current)
  const relatedMessages = Object.values(mockMessages).filter((m) => m.id !== id).slice(0, 3);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `“${message.title}”\n${message.leadParagraph}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: message.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user dismissed or unsupported
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
      {/* 1. Top Navigation: Back button */}
      <div className="pt-1 pb-2 flex items-center justify-between">
        <BackButton onBack={onBack} label="वापस" />
      </div>

      {/* 2. Article Header Area (Not inside a card) */}
      <article className="flex flex-col">
        {/* Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2.5 py-0.5 rounded-md">
            {message.typeLabel}
          </span>
          <DateLabel date={message.date} />
        </div>

        {/* Article Headline */}
        <h1 className="text-[24px] sm:text-[26px] font-bold text-[#16325C] tracking-tight leading-[1.3] mb-2">
          {message.title}
        </h1>

        {/* Author / Source */}
        <div className="flex items-center gap-2 text-[13px] text-[#5C6773] mb-4 pb-3 border-b border-[#E8E5DF]/70">
          <span>लेखक: <strong className="text-[#1F2421] font-semibold">{message.author}</strong></span>
          {message.source && (
            <>
              <span>•</span>
              <span className="italic">{message.source}</span>
            </>
          )}
        </div>

        {/* Optional Mission-related Peaceful Image */}
        {message.imageUrl && (
          <div className="w-full aspect-16/9 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E5DF] mb-5 shadow-2xs">
            <img
              src={message.imageUrl}
              alt={message.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Long-form Reading Article Body */}
        <div className="flex flex-col gap-4 text-[#1F2421] text-[16px] leading-[1.75]">
          {/* Lead Paragraph with gentle emphasis */}
          <p className="text-[17px] font-medium text-[#16325C] leading-[1.7] bg-[#FAF8F5] p-3.5 rounded-xl border-l-3 border-[#16325C]/40">
            {message.leadParagraph}
          </p>

          {/* Body Paragraphs */}
          {message.paragraphs.map((p, idx) => (
            <p key={idx} className="tracking-normal font-normal">
              {p}
            </p>
          ))}

          {/* Key Takeaway / Callout quote */}
          {message.keyTakeaway && (
            <div className="my-2 p-4 rounded-xl bg-linear-to-b from-[#FEFBF6] to-[#FAF6EE] border border-[#D97706]/25 flex items-start gap-3 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <Quote size={14} className="rotate-180" />
              </div>
              <p className="text-[15px] font-medium text-[#8B4513] italic leading-[1.65]">
                {message.keyTakeaway}
              </p>
            </div>
          )}
        </div>

        {/* 3. Bottom Share Section */}
        <div className="mt-8 pt-4 border-t border-[#E8E5DF] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] font-medium text-[#16325C]">
              यह विचार साझा करें
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
      </article>

      {/* 4. Related Content: अन्य विचार */}
      <section className="mt-8 mb-6 flex flex-col gap-3.5">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[17px] font-bold text-[#16325C] tracking-tight">
            अन्य विचार
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedMessages.map((rel) => (
            <MessageCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              date={rel.date}
              content={rel.leadParagraph.slice(0, 95) + '...'}
              author={rel.author}
              topic={rel.topic}
              onReadMore={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToMessage(rel.id);
              }}
            />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
