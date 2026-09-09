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
  Globe,
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
  const { data, adminNotifications, unreadNotifCount, markNotificationAsRead } = useData();

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
      onShowPlaceholderNotice={() => {}}
    >
      <div className="space-y-6">
        {/* 1. Dashboard Title & Greeting */}
        <section className="flex flex-col gap-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-[24px] font-bold text-[#16325C] dark:text-[#93C5FD] tracking-tight">
                नमस्ते 👋
              </h1>
              <p className="text-[15px] font-medium text-[#5C6773] dark:text-gray-300 mt-0.5">
                आज क्या जोड़ना है?
              </p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 bg-[#FAF8F5] dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-xl text-[12.5px] font-semibold text-[#16325C] dark:text-[#93C5FD] hover:bg-[#EEF3FA] transition-all tap-active shrink-0 flex items-center gap-1.5"
            >
              <Globe size={14} />
              <span>वेबसाइट देखें</span>
            </button>
          </div>
        </section>

        {/* 2. 6 Large, Clear Action Cards */}
        <section>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => onNavigate('/admin/vichar/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">✍️</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                विचार जोड़ें
              </span>
            </button>

            <button
              onClick={() => onNavigate('/admin/video/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">🎥</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                वीडियो जोड़ें
              </span>
            </button>

            <button
              onClick={() => onNavigate('/admin/audio/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">🎧</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                ऑडियो जोड़ें
              </span>
            </button>

            <button
              onClick={() => onNavigate('/admin/photo/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">📷</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                फोटो जोड़ें
              </span>
            </button>

            <button
              onClick={() => onNavigate('/admin/document/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">📄</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                दस्तावेज जोड़ें
              </span>
            </button>

            <button
              onClick={() => onNavigate('/admin/notice/new')}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl shadow-2xs hover:border-[#16325C]/30 hover:bg-[#FAF8F5] transition-all group tap-active min-h-[110px]"
            >
              <span className="text-[28px] mb-2 group-hover:scale-110 transition-transform">📢</span>
              <span className="text-[14.5px] font-bold text-[#1F2421] dark:text-white text-center">
                सूचना जोड़ें
              </span>
            </button>
          </div>
        </section>

        {/* 3. Recent Content Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="text-[15px] font-bold text-[#1F2421] dark:text-white tracking-tight">
              हाल की सामग्री
            </h2>
            <span className="text-[12px] text-[#5C6773] dark:text-gray-400 font-medium bg-[#EEF3FA] dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-[#16325C]/10 dark:border-slate-700">
              कुल {totalContentCount} आइटम
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
                  ऊपर दिए गए विकल्पों से नई सामग्री जोड़ें।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Like Notifications & Activity Feed */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-[#1F2421] dark:text-white tracking-tight flex items-center gap-1.5">
                <Bell size={17} className="text-[#16325C] dark:text-[#93C5FD]" />
                <span>गतिविधि व पसंद (Activity Feed)</span>
              </h2>
              {unreadNotifCount > 0 && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifCount} नया
                </span>
              )}
            </div>
            {unreadNotifCount > 0 && (
              <button
                onClick={() => markNotificationAsRead(undefined, true)}
                className="text-[12px] font-semibold text-[#16325C] dark:text-[#93C5FD] hover:underline cursor-pointer"
              >
                सभी पढ़ा हुआ चिन्हित करें
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl p-3.5 shadow-2xs">
            {adminNotifications && adminNotifications.length > 0 ? (
              <div className="space-y-2.5">
                {adminNotifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      !notif.read
                        ? 'bg-[#EEF3FA]/60 dark:bg-slate-700/60 border-[#16325C]/20 dark:border-slate-600'
                        : 'bg-[#FAF8F5]/50 dark:bg-slate-800/50 border-[#E8E5DF]/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-[18px] shrink-0 mt-0.5">👍</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-bold text-[#1E5631] dark:text-emerald-400">
                            {notif.event || '👍 पसंद मिला'}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[13px] font-semibold text-[#1F2421] dark:text-white truncate mt-0.5">
                          "{notif.contentTitle}"
                        </p>
                        <p className="text-[11px] text-[#5C6773] dark:text-gray-400 mt-0.5">
                          कुल पसंद: <strong className="text-[#16325C] dark:text-blue-300">{notif.totalLikes}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-medium text-[#8C96A3] shrink-0">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-[13.5px] font-medium text-[#5C6773] dark:text-gray-300">
                  अभी तक कोई पसंद या नई सूचना नहीं मिली है।
                </p>
                <p className="text-[11.5px] text-[#8C96A3] mt-1">
                  जब उपयोगकर्ता आपकी सामग्री को "👍 पसंद" करेंगे, तो नोटिफिकेशन यहाँ दिखाई देंगे।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Simple Parent Footer Note */}
        <div className="pt-4 border-t border-[#E8E5DF] dark:border-[#334155] text-center">
          <p className="text-[11.5px] text-[#8C96A3]">
            अहिंसा शिक्षा मिशन • वेबसाइट सामग्री प्रबंधक
          </p>
          <p className="text-[11px] text-[#8C96A3] mt-0.5">
            सभी बदलाव तुरंत सार्वजनिक वेबसाइट पर दिखाई देते हैं।
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
