import React from 'react';
import { Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface WebsiteStatusCardProps {
  onViewPublicSite: () => void;
}

export const WebsiteStatusCard: React.FC<WebsiteStatusCardProps> = ({ onViewPublicSite }) => {
  return (
    <div className="p-4 bg-white border border-[#E8E5DF] rounded-2xl shadow-2xs">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]" />
          </span>
          <span className="text-[14px] font-bold text-[#16325C]">
            Website Live
          </span>
        </div>

        <button
          type="button"
          onClick={onViewPublicSite}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] hover:bg-[#E2ECF8] transition-colors tap-active"
        >
          <span>Public Website</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <p className="text-[13px] text-[#5C6773] leading-normal">
        Public website active hai. Sabhi prakashit vichar, video aur samagri live chal rahe hain.
      </p>

      <div className="mt-3 pt-2.5 border-t border-[#E8E5DF] flex items-center justify-between text-[11px] text-[#8C96A3]">
        <span className="flex items-center gap-1 text-[#2E7D32] font-medium">
          <CheckCircle2 size={13} />
          Services normal
        </span>
        <span>Mock Status • v1.0</span>
      </div>
    </div>
  );
};
