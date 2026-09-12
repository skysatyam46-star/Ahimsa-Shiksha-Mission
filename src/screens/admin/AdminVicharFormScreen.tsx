import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { ExpandedTextEditor, ExpandButton } from '../../components/admin/ExpandedTextEditor';
import { useData } from '../../context/DataContext';
import { VicharItem } from '../../lib/adminStore';

interface AdminVicharFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminVicharFormScreen: React.FC<AdminVicharFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addVichar, updateVichar, getVicharById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getVicharById(id) : undefined;

  const [title, setTitle] = useState(isEdit && existingItem ? existingItem.title : '');
  const [author, setAuthor] = useState(isEdit && existingItem ? existingItem.author : 'अहिंसा शिक्षा मिशन');
  const [topic, setTopic] = useState(isEdit && existingItem ? existingItem.topic || 'अहिंसा' : 'अहिंसा');
  const [leadParagraph, setLeadParagraph] = useState(isEdit && existingItem ? existingItem.leadParagraph || '' : '');
  const [bodyText, setBodyText] = useState(isEdit && existingItem ? existingItem.paragraphs?.join('\n\n') || '' : '');
  const [keyTakeaway, setKeyTakeaway] = useState(isEdit && existingItem ? existingItem.keyTakeaway || '' : '');
  const [language, setLanguage] = useState<'hi' | 'en'>(isEdit && existingItem ? existingItem.language || 'hi' : 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(isEdit && existingItem ? existingItem.status || 'published' : 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Expanded Editor Modal State
  const [activeExpandedField, setActiveExpandedField] = useState<{
    key: 'leadParagraph' | 'bodyText';
    title: string;
  } | null>(null);

  useEffect(() => {
    if (isEdit && existingItem) {
      setTitle(existingItem.title || '');
      setAuthor(existingItem.author || 'अहिंसा शिक्षा मिशन');
      setTopic(existingItem.topic || 'अहिंसा');
      setLeadParagraph(existingItem.leadParagraph || '');
      setBodyText(existingItem.paragraphs?.join('\n\n') || '');
      setKeyTakeaway(existingItem.keyTakeaway || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    } else if (!isEdit) {
      setTitle('');
      setAuthor('अहिंसा शिक्षा मिशन');
      setTopic('अहिंसा');
      setLeadParagraph('');
      setBodyText('');
      setKeyTakeaway('');
      setLanguage('hi');
      setStatus('published');
      setError(null);
      setSuccess(null);
    }
  }, [id, isEdit, existingItem]);

  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया विचार का शीर्षक अवश्य दर्ज करें।');
      return;
    }

    if (!leadParagraph.trim() && !bodyText.trim()) {
      setError('कृपया मुख्य विचार संदेश अवश्य दर्ज करें।');
      return;
    }

    const paragraphs = bodyText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const itemPayload: Partial<VicharItem> = {
      title: title.trim(),
      author: author.trim() || 'अहिंसा शिक्षा मिशन',
      topic: topic.trim(),
      leadParagraph: leadParagraph.trim() || paragraphs[0] || '',
      paragraphs: paragraphs.length > 0 ? paragraphs : [leadParagraph.trim()],
      keyTakeaway: keyTakeaway.trim(),
      language,
      status: saveStatus,
    };

    try {
      if (isEdit && id) {
        await updateVichar(id, itemPayload);
        setSuccess('सफलतापूर्वक अपडेट और डेटाबेस में सुरक्षित हो गया!');
      } else {
        await addVichar(itemPayload);
        setSuccess('सफलतापूर्वक प्रकाशित और डेटाबेस में सुरक्षित हो गया!');
      }
      setTimeout(() => {
        onNavigate(`/admin/vichar`);
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'डेटाबेस में सहेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'विचार संपादित करें' : 'नया विचार जोड़ें'}
        subtitle={isEdit ? 'सामग्री को बदलकर सहेजें' : 'वेबसाइट के लिए नया प्रेरणादायक विचार लिखें'}
        onBack={() => onNavigate('/admin/vichar')}
        backLabel="वापस जाएं"
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs space-y-5">
        {/* 1. Title */}
        <div>
          <label htmlFor="vichar-title" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            विचार का शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            id="vichar-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="विचार का शीर्षक लिखें…"
            className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2. Main Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="vichar-lead" className="text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200">
              मुख्य विचार / संदेश <span className="text-red-500">*</span>
            </label>
            <ExpandButton
              onClick={() => setActiveExpandedField({ key: 'leadParagraph', title: 'मुख्य विचार / संदेश' })}
            />
          </div>
          <textarea
            id="vichar-lead"
            rows={3}
            value={leadParagraph}
            onChange={(e) => setLeadParagraph(e.target.value)}
            placeholder="मुख्य विचार या संदेश लिखें…"
            className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 3. Detailed Description (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="vichar-body" className="text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200">
              विस्तृत जानकारी (वैकल्पिक)
            </label>
            <ExpandButton
              onClick={() => setActiveExpandedField({ key: 'bodyText', title: 'विस्तृत जानकारी' })}
            />
          </div>
          <textarea
            id="vichar-body"
            rows={4}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="विस्तृत व्याख्या या अतिरिक्त विवरण…"
            className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/vichar')}
            className="min-h-[44px] px-5 py-2 text-[13.5px] font-semibold text-[#5C6773] dark:text-gray-300 bg-[#F0ECE1] dark:bg-slate-700 hover:bg-[#E8E2D8] rounded-xl transition-colors tap-active order-2 sm:order-1"
          >
            रद्द करें
          </button>

          <div className="flex items-center justify-end gap-2.5 order-1 sm:order-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="min-h-[44px] px-3.5 py-2 text-[12px] font-medium text-[#8C5D07] dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100/80 rounded-xl transition-colors tap-active"
            >
              ड्राफ्ट में रखें
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-6 py-2 text-[14px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] rounded-xl transition-colors shadow-xs tap-active flex-1 sm:flex-initial"
            >
              <Save size={16} />
              <span>विचार प्रकाशित करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Text Editor Modal */}
      {activeExpandedField && (
        <ExpandedTextEditor
          isOpen={Boolean(activeExpandedField)}
          onClose={() => setActiveExpandedField(null)}
          title={activeExpandedField.title}
          value={activeExpandedField.key === 'leadParagraph' ? leadParagraph : bodyText}
          onChange={(newVal) => {
            if (activeExpandedField.key === 'leadParagraph') {
              setLeadParagraph(newVal);
            } else {
              setBodyText(newVal);
            }
          }}
        />
      )}
    </PageContainer>
  );
};
