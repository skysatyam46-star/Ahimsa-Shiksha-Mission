import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { PageContainer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useData } from '../../context/DataContext';
import { VideoItem } from '../../lib/adminStore';

interface AdminVideoFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminVideoFormScreen: React.FC<AdminVideoFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addVideo, updateVideo, getVideoById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getVideoById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [speaker] = useState(existingItem?.speaker || 'अहिंसा शिक्षा मिशन');
  const [duration] = useState(existingItem?.duration || '');
  const [youtubeUrl, setYoutubeUrl] = useState(existingItem?.youtubeUrl || '');
  const [thumbnailUrl] = useState(existingItem?.thumbnailUrl || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [topicsInput] = useState(existingItem?.topics?.join(', ') || 'वीडियो');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && existingItem) {
      setTitle(existingItem.title || '');
      setYoutubeUrl(existingItem.youtubeUrl || '');
      setDescription(existingItem.description || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    } else if (!isEdit) {
      setTitle('');
      setYoutubeUrl('');
      setDescription('');
      setLanguage('hi');
      setStatus('published');
      setError(null);
      setSuccess(null);
    }
  }, [id, isEdit, existingItem]);

  const extractYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  };

  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया वीडियो का शीर्षक लिखें।');
      return;
    }

    if (!youtubeUrl.trim()) {
      setError('कृपया YouTube वीडियो का लिंक डालें।');
      return;
    }

    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      setError('अमान्य YouTube URL! कृपया सही YouTube लिंक दर्ज करें (उदा. https://www.youtube.com/watch?v=... या https://youtu.be/...)');
      return;
    }

    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const autoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const itemPayload: Partial<VideoItem> = {
      title: title.trim(),
      speaker: speaker.trim() || 'अहिंसा शिक्षा मिशन',
      duration: duration.trim() || '',
      youtubeUrl: normalizedUrl,
      youtubeVideoId: videoId,
      thumbnailUrl: thumbnailUrl.trim() || autoThumbnailUrl,
      description: description.trim(),
      topics,
      language,
      status: saveStatus,
    };

    try {
      if (isEdit && id) {
        await updateVideo(id, itemPayload);
        setSuccess('वीडियो सफलतापूर्वक अपडेट और डेटाबेस में सुरक्षित हो गया!');
      } else {
        await addVideo(itemPayload);
        setSuccess('वीडियो सफलतापूर्वक प्रकाशित और डेटाबेस में सुरक्षित हो गया!');
      }

      setTimeout(() => {
        onNavigate('/admin/video');
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'डेटाबेस में सहेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'वीडियो संपादित करें' : 'नया वीडियो जोड़ें'}
        subtitle={isEdit ? 'विवरण बदलें' : 'YouTube वीडियो लिंक डालकर प्रकाशित करें'}
        onBack={() => onNavigate('/admin/video')}
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
          <label htmlFor="video-title" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            वीडियो का शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="वीडियो का नाम लिखें…"
            className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2. YouTube Link */}
        <div>
          <label htmlFor="video-yt" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            YouTube लिंक <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
            <input
              id="video-yt"
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube वीडियो का लिंक यहाँ डालें…"
              className="w-full pl-9 pr-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
            />
          </div>
        </div>

        {/* 3. Description (Optional) */}
        <div>
          <label htmlFor="video-desc" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            विवरण (वैकल्पिक)
          </label>
          <textarea
            id="video-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="वीडियो के बारे में थोड़ा लिखें…"
            className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 4. Language */}
        <div>
          <label className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            सामग्री की भाषा
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-xl border transition-colors ${
                language === 'hi'
                  ? 'bg-[#16325C] text-white border-[#16325C]'
                  : 'bg-[#FAF8F5] dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#E8E5DF] dark:border-slate-700'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-xl border transition-colors ${
                language === 'en'
                  ? 'bg-[#16325C] text-white border-[#16325C]'
                  : 'bg-[#FAF8F5] dark:bg-slate-800 text-[#5C6773] dark:text-gray-300 border-[#E8E5DF] dark:border-slate-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/video')}
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
              <span>वीडियो प्रकाशित करें</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
