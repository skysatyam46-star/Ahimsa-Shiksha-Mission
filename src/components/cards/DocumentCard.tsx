import React from 'react';
import { FileText, Download } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';
import { CardActionRow } from './CardActionRow';

interface DocumentCardProps {
  id?: string;
  title: string;
  description?: string;
  fileType?: string;
  fileSize?: string;
  pages?: number | string;
  date?: string;
  typeLabel?: string;
  onDownload?: () => void;
  onRead?: () => void;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  description,
  fileType = 'PDF',
  fileSize = '1.8 MB',
  pages,
  date,
  typeLabel = '📄 दस्तावेज',
  onDownload,
  onRead,
  className = '',
}) => {
  const handleRead = onRead || onDownload;

  return (
    <ContentCard radius="md" className={`flex flex-col gap-2.5 p-3.5 ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 pb-2">
        <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
          {typeLabel}
        </span>
        {date && <DateLabel date={date} />}
      </div>

      <div className="flex items-start gap-3">
        {/* Document Format Icon */}
        <div className="w-10 h-11 rounded-xl bg-[#EEF3FA] border border-[#16325C]/15 flex flex-col items-center justify-center shrink-0 text-[#16325C]">
          <FileText size={18} strokeWidth={2} />
          <span className="text-[9.5px] font-bold tracking-tight uppercase">
            {fileType}
          </span>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <h3
            onClick={handleRead}
            className={`text-[15.5px] font-bold text-[#16325C] leading-snug line-clamp-2 ${
              handleRead ? 'cursor-pointer hover:underline' : ''
            }`}
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 text-[12px] text-[#5C6773] mt-0.5 flex-wrap">
            <span>{fileSize}</span>
            {pages && (
              <>
                <span>•</span>
                <span>{pages} पृष्ठ</span>
              </>
            )}
          </div>
        </div>
      </div>

      {description && (
        <p className="text-[13.5px] text-[#5C6773] leading-normal line-clamp-2 px-0.5">
          {description}
        </p>
      )}

      {/* Action Row: 👍 पसंद | ↗ साझा करें | विवरण → */}
      <CardActionRow
        contentId={id}
        contentType="document"
        contentTitle={title}
        title={title}
        text={description || title}
        onReadMore={handleRead}
        readMoreText="देखें →"
      />
    </ContentCard>
  );
};

