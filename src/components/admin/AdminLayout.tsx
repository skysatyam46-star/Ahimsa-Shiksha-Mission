import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from './AdminHeader';
import { AdminDrawer } from './AdminDrawer';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onShowPlaceholderNotice: (featureName: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activePath = '/admin',
  onNavigate,
  onLogout,
  onShowPlaceholderNotice,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useApp();


  return (
    <div className="min-h-screen bg-[#F0EDE6] dark:bg-slate-900 sm:py-6 flex justify-center items-start transition-colors duration-200">
      {/* 
        Mobile phone frame container for Admin
        Responsive from 360px up to 520px max width for comfortable admin ergonomics
      */}
      <div className="w-full max-w-[500px] min-h-screen sm:min-h-[844px] bg-[#FAF8F5] dark:bg-[#0F172A] text-[#1F2421] dark:text-gray-100 relative flex flex-col sm:rounded-[32px] sm:shadow-[0_12px_40px_rgba(22,50,92,0.08)] dark:sm:shadow-[0_12px_40px_rgba(0,0,0,0.5)] sm:border sm:border-[#E8E5DF] dark:border-slate-800 overflow-hidden transition-colors duration-200">
        {/* Dedicated Admin Header */}
        <AdminHeader
          onOpenMenu={() => setIsMenuOpen(true)}
          onLogout={onLogout}
          onNavigateToPublic={() => onNavigate('/')}
        />

        {/* Dedicated Admin Drawer Navigation */}
        <AdminDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activePath={activePath}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onShowPlaceholderNotice={onShowPlaceholderNotice}
        />

        {/* Admin Content Area (NO public bottom nav!) */}
        <main className="flex-1 w-full flex flex-col p-4 pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
