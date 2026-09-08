import React, { useMemo } from 'react';
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
import { useData } from '../context/DataContext';

interface AdminDashboardScreenProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  const { data } = useData();

  const totalContentCount =
    data.vichar.length +
    data.videos.length +
    data.audio.length +
    data.photos.length +
    data.documents.length +
    data.notices.length;

  // Build real dynamic recent items
  const recentItems: RecentContentItem[] = useMemo(() => {
    const list: RecentContentItem[] = [];

    // Most recent vichar
    data.vichar.slice(0, 2).forEach((v) => {
      list.push({
        id: v.id,
        type: 'vichar',
        typeLabel: 'Vichar',
        typeIcon: <FileText size={17} strokeWidth={2} />,
        title: (v.title || v.leadParagraph || '').slice(0, 50) + ((v.title || v.leadParagraph || '').length > 50 ? '...' : ''),
        date: v.date,
        status: v.status === 'published' ? 'Published' : 'Draft',
      });
    });

    // Most recent video
    data.videos.slice(0, 2).forEach((v) => {
      list.push({
        id: v.id,
        type: 'video',
        typeLabel: 'Video',
        typeIcon: <Video size={17} strokeWidth={2} />,
        title: v.title,
        date: v.date,
        status: v.status === 'published' ? 'Published' : 'Draft',
      });
    });

    // Most recent audio
    data.audio.slice(0, 1).forEach((a) => {
      list.push({
        id: a.id,
        type: 'audio',
        typeLabel: 'Audio',
        typeIcon: <Headphones size={17} strokeWidth={2} />,
        title: a.title,
        date: a.date,
        status: a.status === 'published' ? 'Published' : 'Draft',
      });
    });

    // Most recent notice
    data.notices.slice(0, 1).forEach((n) => {
      list.push({
        id: n.id,
        type: 'notice',
        typeLabel: 'Notice',
        typeIcon: <Bell size={17} strokeWidth={2} />,
        title: n.title,
        date: n.date,
        status: n.status === 'published' ? 'Published' : 'Draft',
      });
    });

    // Most recent document
    data.documents.slice(0, 1).forEach((d) => {
      list.push({
        id: d.id,
        type: 'document',
        typeLabel: 'Document',
        typeIcon: <Files size={17} strokeWidth={2} />,
        title: d.title,
        date: d.date,
        status: d.status === 'published' ? 'Published' : 'Draft',
      });
    });

    return list.slice(0, 6);
  }, [data]);

  const handleRecentItemClick = (item: RecentContentItem) => {
    switch (item.type) {
      case 'vichar':
        onNavigate(`/admin/vichar/${item.id}/edit`);
        break;
      case 'video':
        onNavigate(`/admin/video/${item.id}/edit`);
        break;
      case 'audio':
        onNavigate(`/admin/audio/${item.id}/edit`);
        break;
      case 'photo':
        onNavigate(`/admin/photo/${item.id}/edit`);
        break;
      case 'document':
        onNavigate(`/admin/document/${item.id}/edit`);
        break;
      case 'notice':
        onNavigate(`/admin/notice/${item.id}/edit`);
        break;
      default:
        onNavigate('/admin');
    }
  };

  return (
    <AdminLayout
      activePath="/admin"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* 1. Dashboard Title & Greeting */}
        <section className="flex flex-col gap-1 border-b border-[#E8E5DF] dark:border-[#334155] pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-[22px] font-bold text-[#16325C] dark:text-[#93C5FD] tracking-tight">
              Dashboard
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] text-[11px] font-semibold border border-[#16325C]/10 dark:border-slate-700">
              <Calendar size={12} />
              <span>Phase 5C CMS Active</span>
            </div>
          </div>
          <p className="text-[13px] text-[#5C6773] dark:text-gray-400 leading-relaxed">
            सामग्री प्रबंधन व वेबसाइट स्थिति का समग्र दृश्य (Local CMS Prototype)
          </p>
        </section>

        {/* 2. Website Status Section */}
        <section>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              Website Status
            </h2>
          </div>
          <WebsiteStatusCard onViewPublicSite={() => onNavigate('/')} />
        </section>

        {/* 3. Overview Statistics Grid */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              Content Overview
            </h2>
            <span className="text-[11px] text-[#5C6773] dark:text-gray-400 font-medium">
              कुल {totalContentCount} आइटम
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <AdminStatCard
              icon={<FileText size={18} />}
              label="Vichar"
              hindiLabel="विचार"
              count={data.vichar.length}
              accentColor="blue"
              onClick={() => onNavigate('/admin/vichar')}
            />
            <AdminStatCard
              icon={<Video size={18} />}
              label="Videos"
              hindiLabel="वीडियो"
              count={data.videos.length}
              accentColor="red"
              onClick={() => onNavigate('/admin/video')}
            />
            <AdminStatCard
              icon={<Headphones size={18} />}
              label="Audio"
              hindiLabel="ऑडियो"
              count={data.audio.length}
              accentColor="purple"
              onClick={() => onNavigate('/admin/audio')}
            />
            <AdminStatCard
              icon={<ImageIcon size={18} />}
              label="Photos"
              hindiLabel="फोटो"
              count={data.photos.length}
              accentColor="green"
              onClick={() => onNavigate('/admin/photo')}
            />
            <AdminStatCard
              icon={<Files size={18} />}
              label="Documents"
              hindiLabel="दस्तावेज"
              count={data.documents.length}
              accentColor="amber"
              onClick={() => onNavigate('/admin/document')}
            />
            <AdminStatCard
              icon={<Bell size={18} />}
              label="Notices"
              hindiLabel="सूचनाएँ"
              count={data.notices.length}
              accentColor="gold"
              onClick={() => onNavigate('/admin/notice')}
            />
          </div>
        </section>

        {/* 4. Quick Actions Section */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              Quick Actions
            </h2>
            <span className="text-[11px] text-[#5C6773] dark:text-gray-400">
              सीधे नई सामग्री जोड़ें
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <QuickActionCard
              icon={<PlusCircle size={18} />}
              title="➕ नया विचार जोड़ें"
              description="दैनिक प्रेरणादायक विचार लिखें"
              onClick={() => onNavigate('/admin/vichar/new')}
            />
            <QuickActionCard
              icon={<VideoIcon size={18} />}
              title="🎥 वीडियो जोड़ें"
              description="YouTube व्याख्यान प्रकाशित करें"
              onClick={() => onNavigate('/admin/video/new')}
            />
            <QuickActionCard
              icon={<AudioIcon size={18} />}
              title="🎧 ऑडियो जोड़ें"
              description="MP3 प्रवचन या संदेश जोड़ें"
              onClick={() => onNavigate('/admin/audio/new')}
            />
            <QuickActionCard
              icon={<ImagePlus size={18} />}
              title="🖼️ फोटो जोड़ें"
              description="आश्रम व कार्यक्रम तस्वीर जोड़ें"
              onClick={() => onNavigate('/admin/photo/new')}
            />
            <QuickActionCard
              icon={<FileUp size={18} />}
              title="📄 दस्तावेज जोड़ें"
              description="PDF पत्रिका व लेख जोड़ें"
              onClick={() => onNavigate('/admin/document/new')}
            />
            <QuickActionCard
              icon={<Megaphone size={18} />}
              title="📢 सूचना जारी करें"
              description="महत्वपूर्ण घोषणा जारी करें"
              onClick={() => onNavigate('/admin/notice/new')}
            />
          </div>
        </section>

        {/* 5. Recent Content Section */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-[14px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              Recent Content
            </h2>
            <span className="text-[11px] text-[#5C6773] dark:text-gray-400">
              हाल की सामग्री (क्लिक कर संपादित करें)
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <RecentContentRow
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onClick={handleRecentItemClick}
                />
              ))
            ) : (
              <div className="w-full py-8 px-4 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-xl text-center flex flex-col items-center justify-center">
                <p className="text-[14px] font-medium text-[#16325C] dark:text-[#93C5FD] mb-1">
                  अभी कोई हालिया सामग्री नहीं है
                </p>
                <p className="text-[12px] text-[#5C6773] dark:text-gray-400">
                  ऊपर दिए गए Quick Actions से नई सामग्री जोड़ें।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#E8E5DF] dark:border-[#334155] text-center">
          <p className="text-[12px] text-[#8C96A3]">
            अहिंसा शिक्षा मिशन • Admin Panel Local CMS Prototype (Phase 5C)
          </p>
          <p className="text-[11px] text-[#8C96A3] mt-0.5">
            सभी बदलाव आपके ब्राउज़र में लाइव सुरक्षित हो रहे हैं और तुरंत सार्वजनिक पृष्ठों पर परिलक्षित होते हैं।
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
