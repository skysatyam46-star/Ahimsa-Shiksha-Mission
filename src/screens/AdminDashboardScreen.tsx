import React, { useState } from 'react';
import {
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Files,
  Bell,
  PlusCircle,
  Video as VideoIcon,
  Headphones as AudioIcon,
  ImagePlus,
  FileUp,
  Megaphone,
  X,
  Info,
  Calendar,
} from 'lucide-react';
import {
  AdminLayout,
  AdminStatCard,
  QuickActionCard,
  RecentContentRow,
  WebsiteStatusCard,
  RecentContentItem,
} from '../components/admin';

interface AdminDashboardScreenProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

// MOCK DATA for Phase 5B UI/UX
const MOCK_RECENT_ITEMS: RecentContentItem[] = [
  {
    id: '1',
    type: 'vichar',
    typeLabel: 'Vichar',
    typeIcon: <FileText size={17} strokeWidth={2} />,
    title: 'अहिंसा हमारे जीवन का मार्ग है',
    date: '7 Sep 2026',
    status: 'Published',
  },
  {
    id: '2',
    type: 'video',
    typeLabel: 'Video',
    typeIcon: <Video size={17} strokeWidth={2} />,
    title: 'अहिंसा और मानवता',
    date: '6 Sep 2026',
    status: 'Published',
  },
  {
    id: '3',
    type: 'audio',
    typeLabel: 'Audio',
    typeIcon: <Headphones size={17} strokeWidth={2} />,
    title: 'आज का विशेष संदेश',
    date: '5 Sep 2026',
    status: 'Published',
  },
  {
    id: '4',
    type: 'notice',
    typeLabel: 'Notice',
    typeIcon: <Bell size={17} strokeWidth={2} />,
    title: 'कार्यक्रम की सूचना',
    date: '4 Sep 2026',
    status: 'Published',
  },
  {
    id: '5',
    type: 'document',
    typeLabel: 'Document',
    typeIcon: <Files size={17} strokeWidth={2} />,
    title: 'अहिंसा दर्शन अध्ययन गाइड',
    date: '2 Sep 2026',
    status: 'Published',
  },
];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  const handleQuickAction = (actionName: string) => {
    showToast(`“${actionName}” फॉर्म Phase 6 में उपलब्ध होगा।`);
  };

  const handleRecentItemClick = (item: RecentContentItem) => {
    showToast(`“${item.title}” का प्रबंधन (Edit/Delete) Phase 6 में जुड़ेगा।`);
  };

  return (
    <AdminLayout
      activePath="/admin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onShowPlaceholderNotice={(name) => showToast(`“${name}” सेक्शन Phase 6 में सक्रिय होगा।`)}
    >
      <div className="space-y-6">
        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div
            role="status"
            className="p-3 bg-[#16325C] text-white rounded-xl shadow-md flex items-center justify-between gap-2 text-[13px] animate-fadeIn"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Info size={16} className="text-[#93C5FD] shrink-0" />
              <span className="truncate">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors shrink-0"
              aria-label="Toast band karein"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 1. Dashboard Title & Greeting */}
        <section className="flex flex-col gap-1 border-b border-[#E8E5DF] pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-[22px] font-bold text-[#16325C] tracking-tight">
              Dashboard
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF3FA] text-[#16325C] text-[11px] font-semibold border border-[#16325C]/10">
              <Calendar size={12} />
              <span>8 Sep 2026</span>
            </div>
          </div>
          <p className="text-[13px] text-[#5C6773] leading-relaxed">
            Aaj website par kya ho raha hai, ek nazar mein dekhein.
          </p>
        </section>

        {/* 2. Website Status Section */}
        <section>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] tracking-tight">
              Website Status
            </h2>
          </div>
          <WebsiteStatusCard onViewPublicSite={() => onNavigate('/')} />
        </section>

        {/* 3. Overview Statistics Grid (MOCK DATA) */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] tracking-tight">
              Content Overview
            </h2>
            <span className="text-[11px] text-[#5C6773] font-medium">
              Kul 96 items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <AdminStatCard
              icon={<FileText size={18} />}
              label="Vichar"
              hindiLabel="विचार"
              count={24}
              accentColor="blue"
              onClick={() => handleQuickAction('Vichar')}
            />
            <AdminStatCard
              icon={<Video size={18} />}
              label="Videos"
              hindiLabel="वीडियो"
              count={12}
              accentColor="red"
              onClick={() => handleQuickAction('Videos')}
            />
            <AdminStatCard
              icon={<Headphones size={18} />}
              label="Audio"
              hindiLabel="ऑडियो"
              count={8}
              accentColor="purple"
              onClick={() => handleQuickAction('Audio')}
            />
            <AdminStatCard
              icon={<ImageIcon size={18} />}
              label="Photos"
              hindiLabel="फोटो"
              count={36}
              accentColor="green"
              onClick={() => handleQuickAction('Photos')}
            />
            <AdminStatCard
              icon={<Files size={18} />}
              label="Documents"
              hindiLabel="दस्तावेज"
              count={10}
              accentColor="amber"
              onClick={() => handleQuickAction('Documents')}
            />
            <AdminStatCard
              icon={<Bell size={18} />}
              label="Notices"
              hindiLabel="सूचनाएँ"
              count={6}
              accentColor="gold"
              onClick={() => handleQuickAction('Notices')}
            />
          </div>
        </section>

        {/* 4. Quick Actions Section */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] tracking-tight">
              Quick Actions
            </h2>
            <span className="text-[11px] text-[#5C6773]">
              Nayi samagri jodein
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <QuickActionCard
              icon={<PlusCircle size={18} />}
              title="➕ Naya Vichar"
              description="Naya prerna sandesh likhein"
              onClick={() => handleQuickAction('Naya Vichar')}
            />
            <QuickActionCard
              icon={<VideoIcon size={18} />}
              title="🎥 Video Add Karein"
              description="YouTube video link publish karein"
              onClick={() => handleQuickAction('Video Add')}
            />
            <QuickActionCard
              icon={<AudioIcon size={18} />}
              title="🎧 Audio Add Karein"
              description="MP3 pravachan upload karein"
              onClick={() => handleQuickAction('Audio Add')}
            />
            <QuickActionCard
              icon={<ImagePlus size={18} />}
              title="🖼️ Photo Add Karein"
              description="Ashram va karyakram photo jodein"
              onClick={() => handleQuickAction('Photo Add')}
            />
            <QuickActionCard
              icon={<FileUp size={18} />}
              title="📄 Document Add Karein"
              description="PDF patrika va lekh upload karein"
              onClick={() => handleQuickAction('Document Add')}
            />
            <QuickActionCard
              icon={<Megaphone size={18} />}
              title="📢 Notice Add Karein"
              description="Mahatvapurna suchna jari karein"
              onClick={() => handleQuickAction('Notice Add')}
            />
          </div>
        </section>

        {/* 5. Recent Content Section */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] tracking-tight">
              Recent Content
            </h2>
            <span className="text-[11px] text-[#5C6773]">
              Haal hi mein prakashit
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {MOCK_RECENT_ITEMS.map((item) => (
              <RecentContentRow
                key={item.id}
                item={item}
                onClick={handleRecentItemClick}
              />
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#E8E5DF] text-center">
          <p className="text-[12px] text-[#8C96A3]">
            अहिंसा शिक्षा मिशन • Admin Panel UI (Phase 5B)
          </p>
          <p className="text-[11px] text-[#8C96A3] mt-0.5">
            Backend & Authentication Phase 6 mein integrate kiye jayenge.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
