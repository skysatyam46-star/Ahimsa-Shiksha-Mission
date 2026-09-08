import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';

interface DocumentCardProps {
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
  return (
    <ContentCard radius="md" className={`flex flex-col gap-3 p-4 ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E5DF]/60 pb-2">
        <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2 py-0.5 rounded-md">
          {typeLabel}
        </span>
        {date && <DateLabel date={date} />}
      </div>

      <div className="flex items-start gap-3.5">
        {/* Document Format Icon */}
        <div className="w-11 h-12 rounded-xl bg-[#EEF3FA] border border-[#16325C]/15 flex flex-col items-center justify-center shrink-0 text-[#16325C]">
          <FileText size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5 uppercase">
            {fileType}
          </span>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#16325C] leading-snug">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-[12px] text-[#5C6773] mt-1 flex-wrap">
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
        <p className="text-[14px] text-[#5C6773] leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions: देखें & डाउनलोड ↓ */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E5DF]/60 mt-auto">
        <button
          type="button"
          onClick={onRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#16325C] bg-[#FAF8F5] hover:bg-[#EEF3FA] border border-[#E8E5DF] rounded-lg transition-colors tap-active"
        >
          <Eye size={15} />
          <span>देखें</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium bg-[#16325C] text-white hover:bg-[#0F2342] rounded-lg transition-colors tap-active shadow-2xs"
        >
          <Download size={14} />
          <span>डाउनलोड ↓</span>
        </button>
      </div>
    </ContentCard>
  );
};
