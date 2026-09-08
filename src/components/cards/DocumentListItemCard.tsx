import React from 'react';
import { FileText, ArrowRight, Eye } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { DateLabel } from '../ui/DateLabel';

interface DocumentListItemCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  fileType?: string;
  fileSize: string;
  pages?: string;
  onClick?: () => void;
  className?: string;
}

export const DocumentListItemCard: React.FC<DocumentListItemCardProps> = ({
  id,
  title,
  description,
  date,
  fileType = 'PDF',
  fileSize,
  pages,
  onClick,
  className = '',
}) => {
  return (
    <ContentCard
      radius="md"
      className={`p-4 flex flex-col gap-2.5 transition-all hover:border-[#CBD5E1] cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Top Meta: Icon + Title */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-11 rounded-xl bg-[#EEF3FA] text-[#16325C] flex flex-col items-center justify-center shrink-0 border border-[#16325C]/15 group-hover:bg-[#E2ECF8] transition-colors">
          <FileText size={18} strokeWidth={2} />
          <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5 text-[#16325C]">
            {fileType}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#16325C] leading-snug group-hover:text-[#0F2342] transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-[12px] text-[#5C6773] mt-0.5 flex-wrap">
            <span className="font-medium text-[#16325C]/80">{fileType} · {fileSize}</span>
            {pages && (
              <>
                <span>•</span>
                <span>{pages} पृष्ठ</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Short description */}
      <p className="text-[14px] text-[#5C6773] leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Footer: Date & "देखें →" */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E8E5DF]/60 mt-auto">
        <DateLabel date={date} />

        <div className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] group-hover:text-[#0F2342] transition-colors">
          <span>देखें</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </ContentCard>
  );
};
