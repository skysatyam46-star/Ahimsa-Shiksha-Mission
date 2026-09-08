import React, { useState, useEffect } from 'react';
import { Save, Eye, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
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
  const { data, addVichar, updateVichar, getVicharById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getVicharById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [author, setAuthor] = useState(existingItem?.author || 'अहिंसा शिक्षा मिशन');
  const [topic, setTopic] = useState(existingItem?.topic || 'अहिंसा');
  const [leadParagraph, setLeadParagraph] = useState(existingItem?.leadParagraph || '');
  const [bodyText, setBodyText] = useState(existingItem?.paragraphs?.join('\n\n') || '');
  const [keyTakeaway, setKeyTakeaway] = useState(existingItem?.keyTakeaway || '');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setAuthor(existingItem.author || 'अहिंसा शिक्षा मिशन');
      setTopic(existingItem.topic || 'अहिंसा');
      setLeadParagraph(existingItem.leadParagraph || '');
      setBodyText(existingItem.paragraphs?.join('\n\n') || '');
      setKeyTakeaway(existingItem.keyTakeaway || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया विचार का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    if (!leadParagraph.trim() && !bodyText.trim()) {
      setError('कृपया मुख्य विचार संदेश या विवरण अवश्य दर्ज करें।');
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

    if (isEdit && id) {
      updateVichar(id, itemPayload);
      setSuccess('विचार सफलतापूर्वक अपडेट हो गया!');
    } else {
      const created = addVichar(itemPayload);
      setSuccess('नया विचार सफलतापूर्वक जोड़ दिया गया!');
      setTimeout(() => {
        onNavigate(`/admin/vichar`);
      }, 1000);
      return;
    }

    setTimeout(() => {
      onNavigate(`/admin/vichar`);
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'विचार संपादित करें (Edit Vichar)' : 'नया विचार जोड़ें (New Vichar)'}
        subtitle={isEdit ? `ID: ${id}` : 'दैनिक विचार या संदेश जोड़ें'}
        onBack={() => onNavigate('/admin/vichar')}
        backLabel="Vichar List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/vichar/${id}`),
              }
            : undefined
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-[13px] font-medium flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="vichar-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            विचार शीर्षक (Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="vichar-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. अहिंसा हमारे जीवन की शक्ति है..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2 Column meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vichar-author" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              लेखक / वक्ता (Author)
            </label>
            <input
              id="vichar-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="अहिंसा शिक्षा मिशन / महात्मा गांधी..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="vichar-topic" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              विषय (Topic / Category)
            </label>
            <input
              id="vichar-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="अहिंसा, सत्य, शांति, शिक्षा..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Lead Paragraph */}
        <div>
          <label htmlFor="vichar-lead" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            प्रमुख विचार / सारांश (Lead Paragraph / Quote) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="vichar-lead"
            rows={3}
            value={leadParagraph}
            onChange={(e) => setLeadParagraph(e.target.value)}
            placeholder="विचार का मुख्य सारांश जो होम पेज व लिस्ट कार्ड पर दिखेगा..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Full Details Paragraphs */}
        <div>
          <label htmlFor="vichar-body" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            विस्तृत व्याख्या (Full Text / Additional Paragraphs)
          </label>
          <textarea
            id="vichar-body"
            rows={5}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="प्रत्येक नए पैराग्राफ के लिए एक खाली लाइन छोड़ें..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Key takeaway */}
        <div>
          <label htmlFor="vichar-takeaway" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            मुख्य सीख / निष्कर्ष (Key Takeaway)
          </label>
          <input
            id="vichar-takeaway"
            type="text"
            value={keyTakeaway}
            onChange={(e) => setKeyTakeaway(e.target.value)}
            placeholder="उदा. अहिंसा मन की दृढ़ता है..."
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Language & Publication Controls */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
              सामग्री की भाषा (Content Language)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${
                  language === 'hi'
                    ? 'bg-[#16325C] text-white border-[#16325C]'
                    : 'bg-white dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#D1D5DB] dark:border-slate-700'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${
                  language === 'en'
                    ? 'bg-[#16325C] text-white border-[#16325C]'
                    : 'bg-white dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#D1D5DB] dark:border-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
              प्रकाशन स्थिति (Status)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${
                  status === 'draft'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#D1D5DB] dark:border-slate-700'
                }`}
              >
                Draft (केवल Admin)
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${
                  status === 'published'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#D1D5DB] dark:border-slate-700'
                }`}
              >
                Published (सार्वजनिक)
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/vichar')}
            className="min-h-[42px] px-4 py-2 text-[13px] font-medium text-[#5C6773] dark:text-gray-300 bg-[#F0ECE1] dark:bg-slate-700 hover:bg-[#E8E2D8] rounded-xl transition-colors tap-active"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="min-h-[42px] px-4 py-2 text-[13px] font-semibold text-[#8C5D07] dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 transition-colors tap-active"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] rounded-xl transition-colors shadow-xs tap-active"
            >
              <Save size={16} />
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Karein'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
