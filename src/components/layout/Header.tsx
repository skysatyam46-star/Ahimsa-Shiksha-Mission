import React from 'react';
import { Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  onOpenSettings?: () => void;
  onOpenAdmin?: () => void;
  isSettingsActive?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'अहिंसा शिक्षा मिशन',
  subtitle,
  rightAction,
  onOpenSettings,
  onOpenAdmin,
  isSettingsActive = false,
  className = '',
}) => {
  const { isAdmin } = useAuth();
  const { unreadNotifCount } = useData();

  return (
    <header
      id="global-header"
      className={`sticky top-0 z-40 w-full h-[56px] bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E5DF] px-4 flex items-center justify-between transition-colors duration-200 ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Logo size={32} />
        <div className="flex flex-col min-w-0">
          <h1 className="text-[17px] font-semibold text-[#16325C] tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-[#5C6773] truncate leading-none mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {rightAction}

        {/* Admin Icon Button (No Text) */}
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            aria-label="Admin Panel"
            title="प्रबंधक (Admin)"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA] transition-all tap-active"
          >
            <ShieldCheck size={20} strokeWidth={1.8} className="text-[#16325C]" />
            {isAdmin && unreadNotifCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        )}

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all tap-active ${
              isSettingsActive
                ? 'bg-[#EEF3FA] text-[#16325C]'
                : 'text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA]'
            }`}
          >
            <SettingsIcon
              size={20}
              strokeWidth={1.8}
              className={`transition-transform duration-200 ${isSettingsActive ? 'rotate-45' : ''}`}
            />
          </button>
        )}
      </div>
    </header>
  );
};


