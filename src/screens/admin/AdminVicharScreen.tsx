import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Eye, FileText, CheckCircle2, Clock } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { useData } from '../../context/DataContext';
import { VicharItem } from '../../lib/adminStore';

interface AdminVicharScreenProps {
  onNavigate: (path: string) => void;
  onOpenDrawer?: () => void;
}

export const AdminVicharScreen: React.FC<AdminVicharScreenProps> = ({ onNavigate }) => {
  const { data, deleteVichar } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [itemToDelete, setItemToDelete] = useState<VicharItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return data.vichar.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.leadParagraph.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [data.vichar, searchQuery, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteVichar(itemToDelete.id);
        showToast(`“${itemToDelete.title}” सफलतापूर्वक हटा दिया गया`);
      } catch (err: any) {
        showToast(err?.message || 'हटाने में विफल।');
      } finally {
        setItemToDelete(null);
      }
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title="विचार सूची"
        subtitle="वेबसाइट पर दिखने वाले विचारों को बदलें या नया जोड़ें"
        badge={`कुल ${data.vichar.length}`}
        onBack={() => onNavigate('/admin')}
        backLabel="Dashboard"
        primaryAction={{
          label: '✍️ नया विचार जोड़ें',
          onClick: () => onNavigate('/admin/vichar/new'),
        }}
      />

      {feedback && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="विचार खोजें (Title, Content, Author)..."
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#0F172A] p-1 rounded-xl border border-[#E8E5DF] dark:border-[#334155] self-start sm:self-auto">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-[12px] font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-white dark:bg-[#1E293B] text-[#16325C] dark:text-[#93C5FD] shadow-2xs'
                  : 'text-[#5C6773] dark:text-gray-400 hover:text-[#1F2421]'
              }`}
            >
              {st === 'all' ? 'सभी (All)' : st === 'published' ? 'प्रकाशित (Published)' : 'ड्राफ्ट (Drafts)'}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E8E5DF] dark:border-[#334155]">
          <FileText size={32} className="mx-auto text-[#8C96A3] mb-2" />
          <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white">कोई विचार नहीं मिला</h3>
          <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 mt-1 mb-4">
            {searchQuery ? 'खोज के अनुसार कोई परिणाम नहीं है।' : 'अभी तक कोई विचार नहीं जोड़ा गया है।'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/admin/vichar/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16325C] text-white text-[12.5px] font-bold rounded-xl"
          >
            <Plus size={14} />
            पहला विचार जोड़ें
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4 shadow-2xs hover:border-[#16325C]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-[#2E7D32] dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-[#D97706] dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.status === 'published' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                    {item.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                  </span>
                  <span className="text-[11.5px] font-medium text-[#8C96A3]">{item.date}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {item.language === 'en' ? 'English' : 'हिंदी'}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white truncate">
                  {item.title}
                </h3>
                <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 line-clamp-1 mt-0.5">
                  {item.leadParagraph || item.paragraphs[0] || 'विवरण उपलब्ध नहीं'}
                </p>
                <span className="text-[11.5px] text-[#8C96A3] mt-1 block">
                  लेखक: {item.author || 'अहिंसा शिक्षा मिशन'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {item.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/vichar/${item.id}`)}
                    className="p-2 text-[#5C6773] dark:text-gray-300 hover:text-[#16325C] dark:hover:text-[#93C5FD] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="वेबसाइट पर देखें"
                  >
                    <Eye size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate(`/admin/vichar/${item.id}/edit`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 hover:bg-[#E2ECF8] rounded-xl transition-colors tap-active"
                >
                  <Edit3 size={14} />
                  <span>बदलाव करें</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-2 text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  title="हटाएं"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        itemTitle={itemToDelete?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />

      <Footer />
    </PageContainer>
  );
};
