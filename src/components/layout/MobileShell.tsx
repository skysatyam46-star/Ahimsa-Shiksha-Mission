import React from 'react';
import { Header } from './Header';
import { BottomNav, NavTabId } from './BottomNav';

interface MobileShellProps {
  currentTab: NavTabId | null;
  onTabChange: (tab: NavTabId, path: string) => void;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  onOpenSettings?: () => void;
  isSettingsActive?: boolean;
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  currentTab,
  onTabChange,
  title,
  subtitle,
  rightAction,
  onOpenSettings,
  isSettingsActive = false,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#F0EDE6] sm:py-6 flex justify-center items-start">
      {/* 
        Mobile phone frame container 
        Designed for 360px, 375px, 390px, 412px, up to 430px width.
      */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-[#FAF8F5] text-[#1F2421] relative flex flex-col sm:rounded-[32px] sm:shadow-[0_12px_40px_rgba(22,50,92,0.08)] sm:border sm:border-[#E8E5DF] overflow-hidden">
        {/* Reusable Header */}
        <Header
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          onOpenSettings={onOpenSettings}
          isSettingsActive={isSettingsActive}
        />

        {/* Main Page Area */}
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>

        {/* Reusable Bottom Navigation */}
        <BottomNav currentTab={currentTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};
