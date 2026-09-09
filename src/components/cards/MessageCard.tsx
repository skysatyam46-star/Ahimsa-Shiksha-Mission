import React from 'react';
import { Quote } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { CardActionRow } from './CardActionRow';

interface MessageCardProps {
  id?: string;
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
  id,
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
    <ContentCard radius="md" className={`flex flex-col gap-3 relative overflow-hidden p-3.5 ${className}`}>
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

      {/* Main Content Area */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-[16px] font-bold text-[#16325C] leading-snug tracking-tight mb-1 line-clamp-2">
              {title}
            </h3>
          )}

          <p className="text-[14.5px] text-[#1F2421] font-normal leading-[1.6] tracking-normal line-clamp-4">
            “{content}”
          </p>

          {!onReadMore && author && (
            <div className="mt-2 text-[12px] font-medium text-[#5C6773]">
              — <span className="font-semibold text-[#16325C]">{author}</span>
              {source && <span className="italic"> ({source})</span>}
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8E5DF] bg-[#FAF8F5]">
            <img src={imageUrl} alt={title || author} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Bottom Action Row: 👍 पसंद | ↗ साझा करें | (optional पूरा पढ़ें →) */}
      <CardActionRow
        contentId={id}
        contentType="vichar"
        contentTitle={title || content}
        title={title || 'अहिंसा संदेश'}
        text={`“${content}”\n— ${author}`}
        onReadMore={onReadMore}
        readMoreText="पूरा पढ़ें →"
      />
    </ContentCard>
  );
};

