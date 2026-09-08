import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  const [variant, setVariant] = useState<'blue' | 'gold' | 'green'>(existingItem?.variant || 'blue');
  const [eventDate, setEventDate] = useState(existingItem?.details?.eventDate || '१५ सितंबर २०२६');
  const [time, setTime] = useState(existingItem?.details?.time || 'प्रातः १०:०० बजे से');
  const [venue, setVenue] = useState(existingItem?.details?.venue || 'मुख्य सभागार, गांधी अध्ययन केंद्र');
  const [subject, setSubject] = useState(existingItem?.details?.subject || 'अहिंसा शिक्षा विचार संगोष्ठी');
  const [guidelinesInput, setGuidelinesInput] = useState(
    existingItem?.guidelines?.join('\n') || '१. समय पर उपस्थित हों।\n२. प्रवेश निःशुल्क है।'
  );
  const [contactInfo, setContactInfo] = useState(
    existingItem?.contactInfo || 'मिशन कार्यालय: contact@example.com'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setContent(existingItem.content);
      setVariant(existingItem.variant || 'blue');
      setEventDate(existingItem.details?.eventDate || '');
      setTime(existingItem.details?.time || '');
      setVenue(existingItem.details?.venue || '');
      setSubject(existingItem.details?.subject || '');
      setGuidelinesInput(existingItem.guidelines?.join('\n') || '');
      setContactInfo(existingItem.contactInfo || '');
      setStatus(existingItem.status || 'published');
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
        title={isEdit ? 'सूचना संपादित करें (Edit Notice)' : 'नई सूचना जारी करें (New Notice)'}
        subtitle={isEdit ? `ID: ${id}` : 'आधिकारिक घोषणा या कार्यक्रम सूचना जोड़ें'}
        onBack={() => onNavigate('/admin/notice')}
        backLabel="Notice List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/notice/${id}`),
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
          <label htmlFor="notice-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            सूचना शीर्षक (Notice Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="notice-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. आगामी विचार संगोष्ठी एवं कार्यशाला..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="notice-content" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            मुख्य संदेश / विवरण (Main Content) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="notice-content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="सूचना का विस्तृत विवरण..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Color Theme Variant */}
        <div>
          <label className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1.5">
            सूचना कार्ड का रंग (Card Theme)
          </label>
          <div className="flex items-center gap-3">
            {[
              { id: 'blue', label: 'नीला (Navy Blue)', border: 'border-[#16325C]', bg: 'bg-[#EEF3FA]' },
              { id: 'gold', label: 'केसरिया (Gold)', border: 'border-[#D97706]', bg: 'bg-[#FEF8EC]' },
              { id: 'green', label: 'हरा (Forest Green)', border: 'border-[#2E7D32]', bg: 'bg-[#F0FDF4]' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12.5px] font-medium transition-all ${
                  variant === v.id
                    ? `${v.bg} ${v.border} font-bold text-[#1F2421] ring-2 ring-offset-1 ring-[#16325C]/30`
                    : 'bg-white dark:bg-slate-800 border-[#E8E5DF] dark:border-slate-700 text-[#5C6773]'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${v.border} ${v.bg}`} />
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] space-y-3">
          <span className="text-[13px] font-bold text-[#1F2421] dark:text-gray-200 block">
            कार्यक्रम / आयोजन विवरण (Event Details)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="notice-date" className="block text-[12px] font-semibold text-[#5C6773] dark:text-gray-300 mb-1">
                तिथि (Event Date)
              </label>
              <input
                id="notice-date"
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="उदा. १५ सितंबर २०२६"
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="notice-time" className="block text-[12px] font-semibold text-[#5C6773] dark:text-gray-300 mb-1">
                समय (Time)
              </label>
              <input
                id="notice-time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="उदा. प्रातः १०:०० बजे से"
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="notice-venue" className="block text-[12px] font-semibold text-[#5C6773] dark:text-gray-300 mb-1">
                स्थान (Venue)
              </label>
              <input
                id="notice-venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="उदा. मुख्य सभागार"
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="notice-subj" className="block text-[12px] font-semibold text-[#5C6773] dark:text-gray-300 mb-1">
                विषय (Subject)
              </label>
              <input
                id="notice-subj"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="उदा. अहिंसा एवं युवा संवाद"
                className="w-full px-3 py-1.5 text-[13px] bg-white dark:bg-slate-800 border border-[#E8E5DF] dark:border-slate-700 rounded-lg text-[#1F2421] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div>
          <label htmlFor="notice-guidelines" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            दिशा-निर्देश (Guidelines / Instructions - Line by line)
          </label>
          <textarea
            id="notice-guidelines"
            rows={3}
            value={guidelinesInput}
            onChange={(e) => setGuidelinesInput(e.target.value)}
            placeholder="१. समय पर पहुंचें&#10;२. अनुशासन बनाए रखें..."
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Contact info */}
        <div>
          <label htmlFor="notice-contact" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            संपर्क / सहायता विवरण (Contact Info)
          </label>
          <input
            id="notice-contact"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="मिशन कार्यालय: contact@example.com / +91 XXXXX XXXXX"
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Publication */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[13px] font-bold text-[#1F2421] dark:text-gray-200 block">
              प्रकाशन स्थिति (Status)
            </span>
            <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400">
              Draft सूचना केवल एडमिन पैनल में दिखाई देगी
            </span>
          </div>

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

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/notice')}
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
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] rounded-xl transition-colors shadow-xs tap-active"
            >
              <Save size={16} />
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Notice'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
