import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#F0EDE6] sm:py-6 flex justify-center items-start">
      {/* 
        Mobile phone frame container for Admin
        Responsive from 360px up to 520px max width for comfortable admin ergonomics
      */}
      <div className="w-full max-w-[500px] min-h-screen sm:min-h-[844px] bg-[#FAF8F5] text-[#1F2421] relative flex flex-col sm:rounded-[32px] sm:shadow-[0_12px_40px_rgba(22,50,92,0.08)] sm:border sm:border-[#E8E5DF] overflow-hidden">
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
