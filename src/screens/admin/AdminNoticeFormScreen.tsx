import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useData } from '../../context/DataContext';
import { NoticeItem } from '../../lib/adminStore';

interface AdminNoticeFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminNoticeFormScreen: React.FC<AdminNoticeFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addNotice, updateNotice, getNoticeById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getNoticeById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [content, setContent] = useState(existingItem?.content || '');
  const [variant] = useState<'blue' | 'gold' | 'green'>(existingItem?.variant || 'blue');
  const [eventDate, setEventDate] = useState(existingItem?.details?.eventDate || '');
  const [time, setTime] = useState(existingItem?.details?.time || '');
  const [venue, setVenue] = useState(existingItem?.details?.venue || '');
  const [subject, setSubject] = useState(existingItem?.details?.subject || '');
  const [guidelinesInput] = useState(existingItem?.guidelines?.join('\n') || '');
  const [contactInfo] = useState(existingItem?.contactInfo || '');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');
  const [showEventInfo, setShowEventInfo] = useState(
    Boolean(existingItem?.details?.eventDate || existingItem?.details?.venue)
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setContent(existingItem.content);
      setEventDate(existingItem.details?.eventDate || '');
      setTime(existingItem.details?.time || '');
      setVenue(existingItem.details?.venue || '');
      setSubject(existingItem.details?.subject || '');
      setStatus(existingItem.status || 'published');
        } else {
      setTitle('');
      setContent('');
      setEventDate('');
      setTime('');
      setVenue('');
      setSubject('');
      setStatus('published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया सूचना का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    if (!content.trim()) {
      setError('कृपया सूचना का मुख्य विवरण (Content) अवश्य दर्ज करें।');
      return;
    }

    const guidelines = guidelinesInput
      .split('\n')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const itemPayload: Partial<NoticeItem> = {
      title: title.trim(),
      content: content.trim(),
      variant,
      details: {
        eventDate: eventDate.trim(),
        time: time.trim(),
        venue: venue.trim(),
        subject: subject.trim(),
      },
      guidelines,
      contactInfo: contactInfo.trim(),
      status: saveStatus,
    };

    if (isEdit && id) {
      updateNotice(id, itemPayload);
      setSuccess('सूचना सफलतापूर्वक अपडेट हो गई!');
    } else {
      addNotice(itemPayload);
      setSuccess('नई सूचना सफलतापूर्वक जारी कर दी गई!');
    }

    setTimeout(() => {
      onNavigate('/admin/notice');
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'सूचना संपादित करें' : 'नई सूचना जारी करें'}
        subtitle={isEdit ? 'विवरण बदलें' : 'अधिकारि घोषणा या सूचना प्रकाशित करें'}
        onBack={() => onNavigate('/admin/notice')}
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
          <label htmlFor="notice-title" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            सूचना का शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            id="notice-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="सूचना का शीर्षक लिखें…"
            className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2. Content */}
        <div>
          <label htmlFor="notice-content" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            मुख्य संदेश / विवरण <span className="text-red-500">*</span>
          </label>
          <textarea
            id="notice-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="सूचना के बारे में विस्तार से लिखें…"
            className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 3. Collapsible Event Info Section */}
        <div>
          <button
            type="button"
            onClick={() => setShowEventInfo(!showEventInfo)}
            className="flex items-center justify-between w-full p-3.5 bg-[#FAF8F5] dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-2xl text-[13.5px] font-bold text-[#16325C] dark:text-[#93C5FD] hover:bg-[#EEF3FA] transition-colors"
          >
            <span>📅 कार्यक्रम/आयोजन की जानकारी (यदि लागू हो)</span>
            {showEventInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showEventInfo && (
            <div className="mt-3 p-4 bg-white dark:bg-slate-900 border border-[#E8E5DF] dark:border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="notice-date" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
                    तिथि (Event Date)
                  </label>
                  <input
                    id="notice-date"
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="उदा. १५ सितंबर २०२६"
                    className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
                  />
                </div>

                <div>
                  <label htmlFor="notice-time" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
                    समय (Time)
                  </label>
                  <input
                    id="notice-time"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="उदा. प्रातः १०:०० बजे से"
                    className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
                  />
                </div>

                <div>
                  <label htmlFor="notice-venue" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
                    स्थान (Venue)
                  </label>
                  <input
                    id="notice-venue"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="उदा. मुख्य सभागार"
                    className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
                  />
                </div>

                <div>
                  <label htmlFor="notice-subj" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
                    विषय (Subject)
                  </label>
                  <input
                    id="notice-subj"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="उदा. अहिंसा एवं युवा संवाद"
                    className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/notice')}
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
              <span>सूचना प्रकाशित करें</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
