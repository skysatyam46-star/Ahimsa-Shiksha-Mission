import React from 'react';
import { Quote, ArrowRight } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { ShareButton } from '../ui/Buttons';

interface MessageCardProps {
  content: string;
  title?: string;
  typeLabel?: string;
  author?: string;
  source?: string;
  date?: string;
  topic?: string;
  imageUrl?: string;
  onReadMore?: () => void;
  onShare?: () => void;
  className?: string;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  content,
  title,
  typeLabel,
  author = 'अहिंसा संदेश',
  source,
  date,
  topic,
  imageUrl,
  onReadMore,
  className = '',
}) => {
  return (
    <ContentCard radius="md" className={`flex flex-col gap-3 relative overflow-hidden p-4 ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {typeLabel ? (
            <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
              {typeLabel}
            </span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0">
              <Quote size={12} className="rotate-180" />
            </div>
          )}

          {topic && (
            <span className="text-[12px] font-medium text-[#5C6773] bg-[#FAF8F5] border border-[#E8E5DF] px-2 py-0.5 rounded-md">
              {topic}
            </span>
          )}
        </div>

        {date && <DateLabel date={date} />}
      </div>

      {/* Main Content Area (Optional right image for editorial touch) */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-[17px] font-bold text-[#16325C] leading-snug tracking-tight mb-1.5">
              {title}
            </h3>
          )}

          <p className="text-[15px] text-[#1F2421] font-normal leading-[1.65] tracking-normal">
            “{content}”
          </p>
        </div>

        {imageUrl && (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8E5DF] bg-[#FAF8F5]">
            <img src={imageUrl} alt={title || author} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Footer / Attribution, Read More & Share */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-[#E8E5DF]/50">
        <div className="flex items-center gap-2">
          {onReadMore ? (
            <button
              type="button"
              onClick={onReadMore}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors py-1 tap-active"
            >
              <span>पूरा पढ़ें</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#16325C] tracking-tight">
                {author}
              </span>
              {source && (
                <span className="text-[11px] text-[#5C6773] leading-none mt-0.5">
                  {source}
                </span>
              )}
            </div>
          )}
        </div>

        <ShareButton
          title={title || 'अहिंसा संदेश'}
          text={`“${content}”\n— ${author}`}
        />
      </div>
    </ContentCard>
  );
};
