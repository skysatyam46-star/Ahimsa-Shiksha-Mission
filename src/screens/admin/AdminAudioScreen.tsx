import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Eye, Headphones, CheckCircle2, Clock } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { useData } from '../../context/DataContext';
import { AudioItem } from '../../lib/adminStore';

interface AdminAudioScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminAudioScreen: React.FC<AdminAudioScreenProps> = ({ onNavigate }) => {
  const { data, deleteAudio } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [itemToDelete, setItemToDelete] = useState<AudioItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return data.audio.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.speaker.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [data.audio, searchQuery, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteAudio(itemToDelete.id);
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
        title="ऑडियो संदेश प्रबंधन (Audio Management)"
        subtitle="ऑडियो प्रवचन, संदेश और व्याख्यान प्रबंधित करें"
        badge={`${data.audio.length} Total`}
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        primaryAction={{
          label: 'नया ऑडियो जोड़ें',
          onClick: () => onNavigate('/admin/audio/new'),
        }}
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/audio'),
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
            placeholder="ऑडियो खोजें (Title, Speaker, Description)..."
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

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
              {st === 'all' ? 'All' : st === 'published' ? 'Published' : 'Drafts'}
            </button>
          ))}
        </div>
      </div>

      {/* Audio List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E8E5DF] dark:border-[#334155]">
          <Headphones size={32} className="mx-auto text-[#8C96A3] mb-2" />
          <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white">कोई ऑडियो संदेश नहीं मिला</h3>
          <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 mt-1 mb-4">
            {searchQuery ? 'खोज के अनुसार कोई ऑडियो संदेश नहीं मिला।' : 'अभी तक कोई ऑडियो संदेश नहीं जोड़ा गया है।'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/admin/audio/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16325C] text-white text-[12.5px] font-bold rounded-xl"
          >
            <Plus size={14} />
            पहला ऑडियो जोड़ें
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-4 shadow-2xs hover:border-[#16325C]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
                  <Headphones size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-[#2E7D32] dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-[#D97706] dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.status === 'published' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[11.5px] font-medium text-[#8C96A3]">{item.date}</span>
                    <span className="text-[11.5px] text-[#8C96A3]">⏱️ {item.duration}</span>
                    {item.fileSize && (
                      <span className="text-[11px] text-[#8C96A3]">({item.fileSize})</span>
                    )}
                  </div>

                  <h3 className="text-[14.5px] font-bold text-[#1F2421] dark:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#5C6773] dark:text-gray-400 line-clamp-1">
                    वक्ता: {item.speaker} • {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {item.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/audio/${item.id}`)}
                    className="p-2 text-[#5C6773] dark:text-gray-300 hover:text-[#16325C] dark:hover:text-[#93C5FD] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Public View"
                  >
                    <Eye size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate(`/admin/audio/${item.id}/edit`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 hover:bg-[#E2ECF8] rounded-xl transition-colors tap-active"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-2 text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  title="Delete"
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
