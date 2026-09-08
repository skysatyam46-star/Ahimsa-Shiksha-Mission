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
import { useData } from '../../context/DataContext';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onShowPlaceholderNotice?: (featureName: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  activePath = '/admin',
  onNavigate,
  onLogout,
}) => {
  const { data } = useData();
  if (!isOpen) return null;

  const handleItemClick = (path: string) => {
    onClose();
    onNavigate(path);
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  const contentNavItems = [
    { icon: <FileText size={17} />, label: 'Vichar (विचार)', count: data.vichar.length, path: '/admin/vichar' },
    { icon: <Video size={17} />, label: 'Videos (वीडियो)', count: data.videos.length, path: '/admin/video' },
    { icon: <Headphones size={17} />, label: 'Audio (ऑडियो)', count: data.audio.length, path: '/admin/audio' },
    { icon: <ImageIcon size={17} />, label: 'Photos (फोटो)', count: data.photos.length, path: '/admin/photo' },
    { icon: <Files size={17} />, label: 'Documents (दस्तावेज)', count: data.documents.length, path: '/admin/document' },
    { icon: <Bell size={17} />, label: 'Notices (सूचनाएँ)', count: data.notices.length, path: '/admin/notice' },
  ];

  const websiteNavItems = [
    { icon: <Compass size={17} />, label: 'Mission (उद्देश्य)', path: '/admin/mission' },
    { icon: <User size={17} />, label: 'Founder (संस्थापक परिचय)', path: '/admin/founder' },
    { icon: <PhoneCall size={17} />, label: 'Contact (संपर्क विवरण)', path: '/admin/contact' },
    { icon: <ExternalLink size={17} />, label: 'Important Links (लिंक)', path: '/admin/links' },
    { icon: <Settings size={17} />, label: 'Settings (सेटिंग्स)', path: '/admin/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Admin Navigation Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-[300px] max-w-[85vw] h-full bg-[#FAF8F5] dark:bg-[#0F172A] text-[#1F2421] dark:text-white shadow-2xl flex flex-col z-10 border-r border-[#E8E5DF] dark:border-[#334155] overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-white dark:bg-[#1E293B] border-b border-[#E8E5DF] dark:border-[#334155] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-[#16325C] dark:text-[#93C5FD] tracking-tight">
                  अहिंसा शिक्षा मिशन
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} className="text-[#2E7D32] dark:text-emerald-400" />
                <span className="text-[11px] font-semibold text-[#2E7D32] dark:text-emerald-400">
                  Admin CMS
                </span>
                <span className="text-[11px] text-[#5C6773] dark:text-gray-400">· Prototype</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menu Band Karein"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C6773] hover:text-[#16325C] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 transition-colors tap-active"
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
              onClick={() => handleItemClick('/admin')}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-colors tap-active ${
                activePath === '/admin'
                  ? 'bg-[#16325C] text-white font-semibold shadow-xs'
                  : 'text-[#1F2421] dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 hover:text-[#16325C]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={18} strokeWidth={2} />
                <span className="text-[14px]">Dashboard</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
                activePath === '/admin' ? 'bg-white/20 text-white' : 'bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD]'
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
              {contentNavItems.map((item) => {
                const isActive = activePath.startsWith(item.path);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full min-h-[40px] px-3 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors tap-active group ${
                      isActive
                        ? 'bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] font-bold'
                        : 'text-[#1F2421] dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 hover:text-[#16325C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-[#5C6773] dark:text-gray-400 group-hover:text-[#16325C] dark:group-hover:text-[#93C5FD]">
                      {item.icon}
                      <span className={`text-[13px] ${isActive ? 'font-bold text-[#16325C] dark:text-[#93C5FD]' : 'font-medium text-[#1F2421] dark:text-gray-200'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#8C96A3] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-[#E8E5DF] dark:border-slate-700">
                        {item.count}
                      </span>
                      <ChevronRight size={14} className="text-[#8C96A3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Website Management */}
          <div>
            <span className="text-[11px] font-bold text-[#8C96A3] uppercase tracking-wider px-3 mb-1.5 block">
              Website (वेबसाइट सेटिंग्स)
            </span>
            <div className="space-y-0.5">
              {websiteNavItems.map((item) => {
                const isActive = activePath === item.path;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full min-h-[40px] px-3 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors tap-active group ${
                      isActive
                        ? 'bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] font-bold'
                        : 'text-[#1F2421] dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 hover:text-[#16325C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-[#5C6773] dark:text-gray-400 group-hover:text-[#16325C] dark:group-hover:text-[#93C5FD]">
                      {item.icon}
                      <span className={`text-[13px] ${isActive ? 'font-bold text-[#16325C] dark:text-[#93C5FD]' : 'font-medium text-[#1F2421] dark:text-gray-200'}`}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-[#8C96A3]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Account */}
          <div className="pt-2 border-t border-[#E8E5DF] dark:border-[#334155]">
            <span className="text-[11px] font-bold text-[#8C96A3] uppercase tracking-wider px-3 mb-1.5 block">
              Account
            </span>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-left text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors tap-active"
            >
              <LogOut size={17} />
              <span className="text-[13px] font-semibold">Logout (लॉगआउट)</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer: Back to Public Website link */}
        <div className="p-3 bg-white dark:bg-[#1E293B] border-t border-[#E8E5DF] dark:border-[#334155] shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('/');
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 hover:bg-[#E2ECF8] transition-colors tap-active"
          >
            <Globe size={15} />
            <span>Public Website Par Jayein</span>
          </button>
        </div>
      </div>
    </div>
  );
};
