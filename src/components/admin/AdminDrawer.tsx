import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Files,
  Bell,
  Compass,
  User,
  PhoneCall,
  ExternalLink,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onShowPlaceholderNotice: (featureName: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  activePath = '/admin',
  onNavigate,
  onLogout,
  onShowPlaceholderNotice,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (path: string, label: string, isImplemented: boolean = false) => {
    onClose();
    if (isImplemented) {
      onNavigate(path);
    } else {
      onShowPlaceholderNotice(label);
    }
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Admin Navigation Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-[300px] max-w-[85vw] h-full bg-[#FAF8F5] text-[#1F2421] shadow-2xl flex flex-col z-10 border-r border-[#E8E5DF] overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-white border-b border-[#E8E5DF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-[#16325C] tracking-tight">
                  अहिंसा शिक्षा मिशन
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} className="text-[#2E7D32]" />
                <span className="text-[11px] font-semibold text-[#2E7D32]">
                  Admin Panel
                </span>
                <span className="text-[11px] text-[#5C6773]">· admin@ahimsa.org</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menu Band Karein"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA] transition-colors tap-active"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Main Dashboard */}
          <div>
            <button
              type="button"
              onClick={() => handleItemClick('/admin', 'Dashboard', true)}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-colors tap-active ${
                activePath === '/admin'
                  ? 'bg-[#16325C] text-white font-semibold shadow-xs'
                  : 'text-[#1F2421] hover:bg-white hover:text-[#16325C]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={18} strokeWidth={2} />
                <span className="text-[14px]">Dashboard</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
                activePath === '/admin' ? 'bg-white/20 text-white' : 'bg-[#EEF3FA] text-[#16325C]'
              }`}>
                Live
              </span>
            </button>
          </div>

          {/* Section: Content Management */}
          <div>
            <span className="text-[11px] font-bold text-[#8C96A3] uppercase tracking-wider px-3 mb-1.5 block">
              Content (सामग्री प्रबंधन)
            </span>
            <div className="space-y-0.5">
              {[
                { icon: <FileText size={17} />, label: 'Vichar (विचार)', count: '24', path: '/admin/vichar' },
                { icon: <Video size={17} />, label: 'Videos (वीडियो)', count: '12', path: '/admin/video' },
                { icon: <Headphones size={17} />, label: 'Audio (ऑडियो)', count: '8', path: '/admin/audio' },
                { icon: <ImageIcon size={17} />, label: 'Photos (फोटो)', count: '36', path: '/admin/photo' },
                { icon: <Files size={17} />, label: 'Documents (दस्तावेज)', count: '10', path: '/admin/document' },
                { icon: <Bell size={17} />, label: 'Notices (सूचनाएँ)', count: '6', path: '/admin/notice' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleItemClick(item.path, item.label, false)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg flex items-center justify-between text-left text-[#1F2421] hover:bg-white hover:text-[#16325C] transition-colors tap-active group"
                >
                  <div className="flex items-center gap-2.5 text-[#5C6773] group-hover:text-[#16325C]">
                    {item.icon}
                    <span className="text-[13px] font-medium text-[#1F2421] group-hover:text-[#16325C]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#8C96A3] bg-[#EEF3FA] px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                    <ChevronRight size={14} className="text-[#8C96A3]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Website Management */}
          <div>
            <span className="text-[11px] font-bold text-[#8C96A3] uppercase tracking-wider px-3 mb-1.5 block">
              Website (वेबसाइट सेटिंग्स)
            </span>
            <div className="space-y-0.5">
              {[
                { icon: <Compass size={17} />, label: 'Mission (उद्देश्य)', path: '/admin/mission' },
                { icon: <User size={17} />, label: 'Founder (संस्थापक परिचय)', path: '/admin/founder' },
                { icon: <PhoneCall size={17} />, label: 'Contact (संपर्क विवरण)', path: '/admin/contact' },
                { icon: <ExternalLink size={17} />, label: 'Important Links (लिंक)', path: '/admin/links' },
                { icon: <Settings size={17} />, label: 'Settings (सेटिंग्स)', path: '/admin/settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleItemClick(item.path, item.label, false)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg flex items-center justify-between text-left text-[#1F2421] hover:bg-white hover:text-[#16325C] transition-colors tap-active group"
                >
                  <div className="flex items-center gap-2.5 text-[#5C6773] group-hover:text-[#16325C]">
                    {item.icon}
                    <span className="text-[13px] font-medium text-[#1F2421] group-hover:text-[#16325C]">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-[#8C96A3]" />
                </button>
              ))}
            </div>
          </div>

          {/* Section: Account */}
          <div className="pt-2 border-t border-[#E8E5DF]">
            <span className="text-[11px] font-bold text-[#8C96A3] uppercase tracking-wider px-3 mb-1.5 block">
              Account
            </span>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-left text-[#DC2626] hover:bg-red-50 transition-colors tap-active"
            >
              <LogOut size={17} />
              <span className="text-[13px] font-semibold">Logout (लॉगआउट)</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer: Back to Public Website link */}
        <div className="p-3 bg-white border-t border-[#E8E5DF] shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('/');
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold text-[#16325C] bg-[#EEF3FA] hover:bg-[#E2ECF8] transition-colors tap-active"
          >
            <Globe size={15} />
            <span>Public Website Par Jayein</span>
          </button>
        </div>
      </div>
    </div>
  );
};
