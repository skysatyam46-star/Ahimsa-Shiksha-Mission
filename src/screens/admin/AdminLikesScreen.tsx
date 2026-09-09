import React, { useMemo, useState } from 'react';
import { ThumbsUp, ChevronLeft, Search } from 'lucide-react';
import { AdminLayout } from '../../components/admin';
import { useData } from '../../context/DataContext';

interface AdminLikesScreenProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface ContentLikeStat {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  likesCount: number;
}

export const AdminLikesScreen: React.FC<AdminLikesScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Gather all items and calculate their like counts dynamically from local data state
  const itemsWithLikes: ContentLikeStat[] = useMemo(() => {
    const list: ContentLikeStat[] = [];

    // 1. Vichar
    data.vichar.forEach((item) => {
      list.push({
        id: item.id,
        type: 'vichar',
        typeLabel: 'विचार',
        title: item.title,
        likesCount: (item as any).likes || 0,
      });
    });

    // 2. Videos
    data.videos.forEach((item) => {
      list.push({
        id: item.id,
        type: 'video',
        typeLabel: 'वीडियो',
        title: item.title,
        likesCount: (item as any).likes || 0,
      });
    });

    // 3. Audio
    data.audio.forEach((item) => {
      list.push({
        id: item.id,
        type: 'audio',
        typeLabel: 'ऑडियो',
        title: item.title,
        likesCount: (item as any).likes || 0,
      });
    });

    // 4. Photo
    data.photos.forEach((item) => {
      list.push({
        id: item.id,
        type: 'photo',
        typeLabel: 'फोटो',
        title: item.title || 'शीर्षक रहित फोटो',
        likesCount: (item as any).likes || 0,
      });
    });

    // 5. Document
    data.documents.forEach((item) => {
      list.push({
        id: item.id,
        type: 'document',
        typeLabel: 'दस्तावेज',
        title: item.title,
        likesCount: (item as any).likes || 0,
      });
    });

    // 6. Notice
    data.notices.forEach((item) => {
      list.push({
        id: item.id,
        type: 'notice',
        typeLabel: 'सूचना',
        title: item.title,
        likesCount: (item as any).likes || 0,
      });
    });

    // Sort descending by likesCount
    return list.sort((a, b) => b.likesCount - a.likesCount);
  }, [data]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return itemsWithLikes;
    return itemsWithLikes.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.typeLabel.toLowerCase().includes(query)
    );
  }, [itemsWithLikes, searchQuery]);

  return (
    <AdminLayout
      activePath="/admin/likes"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <section className="flex items-center gap-3 pb-1">
          <button
            onClick={() => onNavigate('/admin')}
            className="w-8 h-8 rounded-lg border border-[#E8E5DF] dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 hover:text-[#16325C] dark:hover:text-[#93C5FD] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-[#16325C] dark:text-[#93C5FD] tracking-tight flex items-center gap-2">
              <ThumbsUp size={20} className="text-[#16325C] dark:text-[#93C5FD]" />
              <span>सामग्री पसंद विवरण (Likes Details)</span>
            </h1>
            <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 mt-0.5">
              यहाँ आप देख सकते हैं कि किस सामग्री को कितने यूज़र्स ने पसंद किया है।
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शीर्षक या श्रेणी खोजें..."
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* List Layout (NO CARDS - "cardle show na kare") */}
        <div className="bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xs">
          {filteredItems.length > 0 ? (
            <div className="divide-y divide-[#E8E5DF]/60 dark:divide-slate-700/60">
              {/* Table Header row */}
              <div className="hidden sm:flex items-center justify-between p-3.5 bg-[#FAF8F5] dark:bg-slate-900/40 text-[12px] font-bold text-[#8C96A3] uppercase tracking-wider">
                <div className="flex-1">शीर्षक / सामग्री का नाम</div>
                <div className="w-24 text-center">श्रेणी</div>
                <div className="w-24 text-right">कुल पसंद</div>
              </div>

              {filteredItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 hover:bg-[#EEF3FA]/30 dark:hover:bg-slate-700/30 transition-colors"
                >
                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#1F2421] dark:text-white truncate">
                      {item.title}
                    </p>
                  </div>

                  {/* Meta Group (Category and Likes count) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    {/* Category Label */}
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-slate-700 border border-[#E8E5DF] dark:border-slate-600 text-[#5C6773] dark:text-gray-300">
                      {item.typeLabel}
                    </span>

                    {/* Likes Score */}
                    <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                      <ThumbsUp size={14} className="text-[#16325C] dark:text-[#93C5FD]" />
                      <span className="text-[14px] font-bold text-[#16325C] dark:text-[#93C5FD]">
                        {item.likesCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center">
              <p className="text-[14px] font-semibold text-[#5C6773] dark:text-gray-300">
                कोई मिलान नहीं मिला
              </p>
              <p className="text-[12px] text-[#8C96A3] mt-1">
                कृपया कोई दूसरा खोज शब्द उपयोग करें।
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
