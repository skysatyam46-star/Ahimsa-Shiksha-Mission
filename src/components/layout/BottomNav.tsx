import React from 'react';
import { Home, BookOpen, PlayCircle, FolderArchive, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTabId = 'home' | 'vichar' | 'video' | 'samagri' | 'khoj';

export interface NavItem {
  id: NavTabId;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
}

interface BottomNavProps {
  currentTab: NavTabId | null;
  onTabChange: (tab: NavTabId, path: string) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  className = '',
}) => {
  const { t } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: t.navHome,
      path: '/',
      icon: Home,
    },
    {
      id: 'vichar',
      label: t.navVichar,
      path: '/vichar',
      icon: BookOpen,
    },
    {
      id: 'video',
      label: t.navVideo,
      path: '/video',
      icon: PlayCircle,
    },
    {
      id: 'samagri',
      label: t.navSamagri,
      path: '/samagri',
      icon: FolderArchive,
    },
    {
      id: 'khoj',
      label: t.navKhoj,
      path: '/khoj',
      icon: Search,
    },
  ];

  return (
    <nav
      id="fixed-bottom-nav"
      aria-label="मुख्य नेविगेशन"
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8E5DF] transition-all duration-200 ${className}`}
    >
      <div className="w-full max-w-[430px] mx-auto h-[64px] px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              type="button"
              onClick={() => onTabChange(item.id, item.path)}
              className={`flex-1 min-w-[56px] h-full flex flex-col items-center justify-center gap-1 transition-all duration-150 relative tap-active focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16325C]/30 ${
                isActive ? 'text-[#16325C]' : 'text-[#5C6773] hover:text-[#1F2421]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={`transition-transform duration-150 ${isActive ? 'scale-105' : ''}`}
              />
              <span
                className={`text-[11px] leading-tight font-medium tracking-tight whitespace-nowrap ${
                  isActive ? 'font-semibold text-[#16325C]' : 'text-[#5C6773]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safe Area Inset Padding for modern iOS/Android Home Indicator */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
};

