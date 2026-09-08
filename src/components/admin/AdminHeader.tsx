import React from 'react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onOpenMenu: () => void;
  onLogout: () => void;
  onNavigateToPublic: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMenu,
  onLogout,
  onNavigateToPublic,
}) => {
  const { user } = useAuth();
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const displayName = user?.email ? user.email.split('@')[0] : 'Admin';

  return (
    <header
      id="admin-header"
      className="sticky top-0 z-40 w-full h-[58px] bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E5DF] px-3.5 sm:px-4 flex items-center justify-between transition-colors duration-200"
    >
      {/* Left: Hamburger menu + Logo + Brand Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Admin Navigation Menu Kholein"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#16325C] hover:bg-[#EEF3FA] transition-colors tap-active shrink-0"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Logo size={30} />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-[#16325C] tracking-tight truncate leading-tight">
                अहिंसा शिक्षा मिशन
              </span>
              <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#16325C]/10 text-[#16325C] shrink-0">
                <ShieldCheck size={11} />
                Admin
              </span>
            </div>
            <span className="text-[11px] text-[#5C6773] truncate leading-none mt-0.5">
              प्रबंधन डैशबोर्ड (Admin Panel)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Public Site link + Admin Avatar + Logout */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Public Website Preview Link */}
        <button
          type="button"
          onClick={onNavigateToPublic}
          title="Public Website Dekhein"
          aria-label="Public Website Dekhein"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#16325C] hover:bg-[#EEF3FA] transition-colors tap-active"
        >
          <ExternalLink size={14} />
          <span>Public Site</span>
        </button>

        {/* Admin Avatar Badge */}
        <div
          title={user?.email || 'Admin'}
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-white border border-[#E8E5DF] shadow-2xs max-w-[150px]"
        >
          <div className="w-6 h-6 rounded-full bg-[#16325C] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {initial}
          </div>
          <span className="text-[12px] font-semibold text-[#16325C] truncate hidden xs:inline">
            {displayName}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout Karein"
          title="Logout"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#5C6773] hover:text-[#DC2626] hover:bg-red-50 transition-colors tap-active"
        >
          <LogOut size={18} strokeWidth={1.9} />
        </button>
      </div>
    </header>
  );
};
