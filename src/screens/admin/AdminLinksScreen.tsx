import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, ExternalLink, Globe, CheckCircle2, Save, X } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { ExpandedTextEditor, ExpandButton } from '../../components/admin/ExpandedTextEditor';
import { useData } from '../../context/DataContext';
import { LinkItem } from '../../lib/adminStore';

interface AdminLinksScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminLinksScreen: React.FC<AdminLinksScreenProps> = ({ onNavigate }) => {
  const { data, addLink, updateLink, deleteLink, reorderLinks } = useData();
  const [itemToDelete, setItemToDelete] = useState<LinkItem | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Expanded Editor Modal State
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingLink(null);
    setTitle('');
    setUrl('');
    setDescription('');
    setStatus('published');
    setError(null);
  };

  const handleStartEdit = (link: LinkItem) => {
    setEditingLink(link);
    setIsAdding(false);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description);
    setStatus(link.status);
    setError(null);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingLink(null);
    setError(null);
  };

  const handleSaveForm = async () => {
    if (!title.trim()) {
      setError('कृपया लिंक का शीर्षक (Title) दर्ज करें।');
      return;
    }
    if (!url.trim()) {
      setError('कृपया मान्य URL दर्ज करें।');
      return;
    }

    try {
      if (editingLink) {
        await updateLink(editingLink.id, {
          title: title.trim(),
          url: url.trim(),
          description: description.trim(),
          status,
        });
        showToast('लिंक सफलतापूर्वक अपडेट और सुरक्षित हो गया');
      } else {
        await addLink({
          title: title.trim(),
          url: url.trim(),
          description: description.trim(),
          status,
        });
        showToast('नया लिंक सफलतापूर्वक जोड़ और सुरक्षित कर दिया गया');
      }

      handleCancelForm();
    } catch (err: any) {
      setError(err?.message || 'डेटाबेस में सहेजने में विफल।');
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteLink(itemToDelete.id);
        showToast(`“${itemToDelete.title}” सफलतापूर्वक हटा दिया गया`);
      } catch (err: any) {
        showToast(err?.message || 'हटाने में विफल।');
      } finally {
        setItemToDelete(null);
      }
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...data.links].sort((a, b) => a.order - b.order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    reorderLinks(sorted.map((l) => l.id));
  };

  const moveDown = (index: number) => {
    const sorted = [...data.links].sort((a, b) => a.order - b.order);
    if (index >= sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    reorderLinks(sorted.map((l) => l.id));
  };

  const sortedLinks = [...data.links].sort((a, b) => a.order - b.order);

  return (
    <PageContainer>
      <AdminPageHeader
        title="महत्वपूर्ण लिंक प्रबंधन (Important Links)"
        subtitle="आधिकारिक वेबसाइट, यूट्यूब, कम्युनिटी और अध्ययन स्रोतों के लिंक प्रबंधित करें"
        badge={`${data.links.length} Links`}
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        primaryAction={{
          label: 'नया लिंक जोड़ें',
          onClick: handleStartAdd,
        }}
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/links'),
        }}
      />

      {feedback && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add / Edit Inline Form */}
      {(isAdding || editingLink) && (
        <div className="mb-5 p-5 bg-[#FAF8F5] dark:bg-[#0F172A] border-2 border-[#16325C]/30 dark:border-[#93C5FD]/30 rounded-2xl space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#16325C] dark:text-[#93C5FD]">
              {editingLink ? 'लिंक संपादित करें' : 'नया लिंक जोड़ें'}
            </h3>
            <button
              type="button"
              onClick={handleCancelForm}
              className="p-1 text-[#8C96A3] hover:text-[#1F2421] dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <p className="text-[12px] font-semibold text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="link-title" className="block text-[12px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
                लिंक शीर्षक (Title) <span className="text-red-500">*</span>
              </label>
              <input
                id="link-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. यूट्यूब चैनल / आधिकारिक वेबसाइट..."
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="link-url" className="block text-[12px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
                URL / Link <span className="text-red-500">*</span>
              </label>
              <input
                id="link-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.org"
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="link-desc" className="text-[12px] font-semibold text-[#1F2421] dark:text-gray-200">
                विवरण (Description)
              </label>
              <ExpandButton onClick={() => setIsDescriptionExpanded(true)} />
            </div>
            <input
              id="link-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="लिंक के बारे में एक पंक्ति का विवरण..."
              className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#5C6773]">Status:</span>
              <button
                type="button"
                onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                  status === 'published'
                    ? 'bg-emerald-100 text-[#2E7D32] dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-[#D97706] dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {status === 'published' ? 'Published' : 'Draft'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-3 py-1.5 text-[12px] text-[#5C6773] hover:bg-black/5 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveForm}
                className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#16325C] text-white text-[12px] font-bold rounded-lg hover:bg-[#1B3C6E]"
              >
                <Save size={13} />
                <span>{editingLink ? 'Save Changes' : 'Add Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links List with Reordering */}
      {sortedLinks.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E8E5DF] dark:border-[#334155]">
          <Globe size={32} className="mx-auto text-[#8C96A3] mb-2" />
          <h3 className="text-[15px] font-bold text-[#1F2421] dark:text-white">कोई लिंक नहीं मिला</h3>
          <p className="text-[12.5px] text-[#5C6773] dark:text-gray-400 mt-1 mb-4">
            अभी तक कोई महत्वपूर्ण लिंक नहीं जोड़ा गया है।
          </p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16325C] text-white text-[12.5px] font-bold rounded-xl"
          >
            <Plus size={14} />
            पहला लिंक जोड़ें
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sortedLinks.map((link, idx) => (
            <div
              key={link.id}
              className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3"
            >
              {/* Reorder Buttons */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveUp(idx)}
                  className={`p-1 rounded ${
                    idx === 0
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-[#5C6773] hover:bg-[#EEF3FA] dark:hover:bg-slate-800'
                  }`}
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedLinks.length - 1}
                  onClick={() => moveDown(idx)}
                  className={`p-1 rounded ${
                    idx === sortedLinks.length - 1
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-[#5C6773] hover:bg-[#EEF3FA] dark:hover:bg-slate-800'
                  }`}
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              {/* Link Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded ${
                      link.status === 'published'
                        ? 'bg-emerald-100 text-[#2E7D32] dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-[#D97706] dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {link.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <h4 className="text-[14px] font-bold text-[#1F2421] dark:text-white truncate">
                    {link.title}
                  </h4>
                </div>
                <p className="text-[12px] text-[#5C6773] dark:text-gray-400 truncate">
                  {link.description || link.url}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#16325C] dark:text-[#93C5FD] hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>{link.url}</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(link)}
                  className="p-2 text-[#16325C] dark:text-[#93C5FD] hover:bg-[#EEF3FA] dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(link)}
                  className="p-2 text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
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

      {/* Expanded Text Editor Modal */}
      {isDescriptionExpanded && (
        <ExpandedTextEditor
          isOpen={isDescriptionExpanded}
          onClose={() => setIsDescriptionExpanded(false)}
          title="लिंक विवरण"
          value={description}
          onChange={(newVal) => setDescription(newVal)}
        />
      )}

      <Footer />
    </PageContainer>
  );
};
