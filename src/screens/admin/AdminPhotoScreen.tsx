import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Eye, Image as ImageIcon, CheckCircle2, Clock } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { useData } from '../../context/DataContext';
import { PhotoItem } from '../../lib/adminStore';

interface AdminPhotoScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminPhotoScreen: React.FC<AdminPhotoScreenProps> = ({ onNavigate }) => {
  const { data, deletePhoto } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [itemToDelete, setItemToDelete] = useState<PhotoItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return data.photos.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [data.photos, searchQuery, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deletePhoto(itemToDelete.id);
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
        title="फोटो गैलरी प्रबंधन (Photo Management)"
        subtitle="मिशन के कार्यक्रमों और आयोजनों की तस्वीरें प्रबंधित करें"
        badge={`${data.photos.length} Total`}
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        primaryAction={{
          label: 'नई फोटो जोड़ें',
          onClick: () => onNavigate('/admin/photo/new'),
        }}
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/photo'),
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
            placeholder="फोटो खोजें (Title, Caption, Location)..."
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

      {/* Photo List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E8E5DF] dark:border-[#334155]">
          <ImageIcon size={32} className="mx-auto text-[#8C96A3] mb-2" />
          <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white">कोई फोटो नहीं मिली</h3>
          <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 mt-1 mb-4">
            {searchQuery ? 'खोज के अनुसार कोई फोटो उपलब्ध नहीं है।' : 'अभी तक कोई फोटो नहीं जोड़ी गई है।'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/admin/photo/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16325C] text-white text-[12.5px] font-bold rounded-xl"
          >
            <Plus size={14} />
            पहली फोटो जोड़ें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl overflow-hidden shadow-2xs hover:border-[#16325C]/30 transition-all flex flex-col"
            >
              {/* Photo Image Frame */}
              <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                      item.status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {item.status === 'published' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Photo Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11.5px] text-[#8C96A3] mb-1">
                    <span>{item.date}</span>
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1F2421] dark:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#5C6773] dark:text-gray-400 line-clamp-1 mt-0.5">
                    {item.caption || item.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 pt-3 mt-2 border-t border-[#E8E5DF] dark:border-[#334155]">
                  {item.status === 'published' && (
                    <button
                      type="button"
                      onClick={() => onNavigate(`/photo/${item.id}`)}
                      className="p-1.5 text-[#5C6773] dark:text-gray-300 hover:text-[#16325C] dark:hover:text-[#93C5FD] rounded-lg transition-colors"
                      title="Public View"
                    >
                      <Eye size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigate(`/admin/photo/${item.id}/edit`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 hover:bg-[#E2ECF8] rounded-lg transition-colors tap-active"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
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
