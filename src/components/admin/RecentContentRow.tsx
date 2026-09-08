import React from 'react';
import { ChevronRight } from 'lucide-react';

export type ContentType = 'vichar' | 'video' | 'audio' | 'notice' | 'document' | 'photo';

export interface RecentContentItem {
  id: string;
  type: ContentType;
  typeLabel: string;
  typeIcon: React.ReactNode;
  title: string;
  date: string;
  status: 'Published' | 'Draft' | 'Scheduled';
}

interface RecentContentRowProps {
  item: RecentContentItem;
  onClick: (item: RecentContentItem) => void;
}

export const RecentContentRow: React.FC<RecentContentRowProps> = ({ item, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="w-full p-3.5 bg-white border border-[#E8E5DF] hover:border-[#16325C]/30 rounded-xl flex items-center justify-between gap-3 text-left transition-all group tap-active shadow-2xs"
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Type Icon Box */}
        <div className="w-8 h-8 rounded-lg bg-[#EEF3FA] text-[#16325C] flex items-center justify-center shrink-0 border border-[#16325C]/10 mt-0.5">
          {item.typeIcon}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h4 className="text-[14px] font-semibold text-[#1F2421] group-hover:text-[#16325C] transition-colors leading-snug line-clamp-1">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-[#5C6773]">
            <span className="font-medium text-[#16325C] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E8E5DF]">
              {item.typeLabel}
            </span>
            <span>•</span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>

      {/* Status & Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
          {item.status}
        </span>
        <ChevronRight
          size={16}
          className="text-[#8C96A3] group-hover:text-[#16325C] transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  );
};
