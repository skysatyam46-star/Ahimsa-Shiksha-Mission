import React from 'react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

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
  const { theme, setTheme } = useApp();
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const displayName = user?.email ? user.email.split('@')[0] : 'Admin';

  return (
    <header
      id="admin-header"
      className="sticky top-0 z-40 w-full h-[58px] bg-[#FAF8F5]/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#E8E5DF] dark:border-slate-800 px-3.5 sm:px-4 flex items-center justify-between transition-colors duration-200"
    >
      {/* Left: Hamburger menu + Logo + Brand Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Admin Navigation Menu Kholein"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#16325C] dark:text-[#93C5FD] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 transition-colors tap-active shrink-0"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Logo size={30} />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-[#16325C] dark:text-white tracking-tight truncate leading-tight">
                अहिंसा शिक्षा मिशन
              </span>
              <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#16325C]/10 dark:bg-blue-500/20 text-[#16325C] dark:text-blue-300 shrink-0">
                <ShieldCheck size={11} />
                प्रबंधक
              </span>
            </div>
            <span className="text-[11px] text-[#5C6773] dark:text-slate-400 truncate leading-none mt-0.5">
              सामग्री प्रबंधक (Website Manager)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Public Site link + Admin Avatar + Logout */}
      <div className="flex items-center gap-1 shrink-0">
        
        {/* Single Click Theme Toggle Button on Top */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'डार्क मोड पर बदलें' : 'लाइट मोड पर बदलें'}
          title={theme === 'light' ? 'डार्क मोड करें' : 'लाइट मोड करें'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 shadow-2xs hover:bg-[#EEF3FA] dark:hover:bg-slate-700 text-[#16325C] dark:text-[#93C5FD] transition-all tap-active shrink-0"
        >
          {theme === 'light' ? (
            <>
              <Sun size={16} className="text-amber-500 fill-amber-400/30" />
              <span className="text-[12px] font-semibold text-[#1F2421]">लाइट</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-blue-300 fill-blue-300/30" />
              <span className="text-[12px] font-semibold text-white">डार्क</span>
            </>
          )}
        </button>

        {/* Public Website Preview Link */}
        <button
          type="button"
          onClick={onNavigateToPublic}
          title="Public Website Dekhein"
          aria-label="Public Website Dekhein"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#16325C] dark:text-[#93C5FD] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 transition-colors tap-active"
        >
          <ExternalLink size={14} />
          <span>Public Site</span>
        </button>

        {/* Admin Avatar Badge */}
        <div
          title={user?.email || 'Admin'}
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 shadow-2xs max-w-[150px]"
        >
          <div className="w-6 h-6 rounded-full bg-[#16325C] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {initial}
          </div>
          <span className="text-[12px] font-semibold text-[#16325C] dark:text-white truncate hidden xs:inline">
            {displayName}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout Karein"
          title="Logout"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#5C6773] dark:text-slate-400 hover:text-[#DC2626] dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors tap-active"
        >
          <LogOut size={18} strokeWidth={1.9} />
        </button>
      </div>
    </header>
  );
};
