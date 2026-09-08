import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Video, Globe } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
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
  const [speaker, setSpeaker] = useState(existingItem?.speaker || 'आचार्य विद्यानंद');
  const [duration, setDuration] = useState(existingItem?.duration || '१४:२०');
  const [youtubeUrl, setYoutubeUrl] = useState(existingItem?.youtubeUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(existingItem?.thumbnailUrl || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [topicsInput, setTopicsInput] = useState(existingItem?.topics?.join(', ') || 'अहिंसा, मानवता');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setSpeaker(existingItem.speaker);
      setDuration(existingItem.duration);
      setYoutubeUrl(existingItem.youtubeUrl);
      setThumbnailUrl(existingItem.thumbnailUrl);
      setDescription(existingItem.description);
      setTopicsInput(existingItem.topics?.join(', ') || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया वीडियो का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    if (!youtubeUrl.trim()) {
      setError('कृपया मान्य YouTube वीडियो लिंक दर्ज करें।');
      return;
    }

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const itemPayload: Partial<VideoItem> = {
      title: title.trim(),
      speaker: speaker.trim() || 'अहिंसा शिक्षा मिशन',
      duration: duration.trim() || '१०:००',
      youtubeUrl: youtubeUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || '',
      description: description.trim() || 'वीडियो व्याख्यान विवरण',
      topics,
      language,
      status: saveStatus,
    };

    if (isEdit && id) {
      updateVideo(id, itemPayload);
      setSuccess('वीडियो सफलतापूर्वक अपडेट हो गया!');
    } else {
      addVideo(itemPayload);
      setSuccess('नया वीडियो सफलतापूर्वक जोड़ दिया गया!');
    }

    setTimeout(() => {
      onNavigate('/admin/video');
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'वीडियो संपादित करें (Edit Video)' : 'नया वीडियो जोड़ें (Add Video)'}
        subtitle={isEdit ? `ID: ${id}` : 'YouTube व्याख्यान या सत्संग वीडियो जोड़ें'}
        onBack={() => onNavigate('/admin/video')}
        backLabel="Video List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/video/${id}`),
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
          <label htmlFor="video-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            वीडियो शीर्षक (Video Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. अहिंसा और मानवता पर विशेष व्याख्यान..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* YouTube Link */}
        <div>
          <label htmlFor="video-yt" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            YouTube URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
            <input
              id="video-yt"
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-9 pr-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>
          <span className="text-[11px] text-[#8C96A3] mt-1 block">
            मान्य यूट्यूब वीडियो का लिंक दर्ज करें (e.g. youtube.com/watch?v=... या youtu.be/...)
          </span>
        </div>

        {/* Speaker & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="video-speaker" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              वक्ता / मार्गदर्शक (Speaker)
            </label>
            <input
              id="video-speaker"
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="आचार्य विद्यानंद / प्रो. शांति स्वरूप..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="video-duration" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              अवधि (Duration)
            </label>
            <input
              id="video-duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="१५:३० (MM:SS)"
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Thumbnail Selector / Upload */}
        <AdminFileUpload
          id="video-thumbnail-file"
          label="कस्टम थंबनेल (Custom Thumbnail / Optional)"
          accept="image/*"
          type="image"
          currentUrl={thumbnailUrl}
          currentFileName="Thumbnail Image"
          hint="JPG, PNG या WebP इमेज सेलेक्ट करें"
          onFileSelect={(info) => setThumbnailUrl(info.previewUrl)}
          onClear={() => setThumbnailUrl('')}
        />

        {/* Description */}
        <div>
          <label htmlFor="video-desc" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            विवरण (Description)
          </label>
          <textarea
            id="video-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="इस वीडियो में चर्चा किए गए मुख्य बिंदुओं का संक्षिप्त विवरण..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Topics */}
        <div>
          <label htmlFor="video-topics" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            प्रमुख विषय / टैग (Topics - Comma Separated)
          </label>
          <input
            id="video-topics"
            type="text"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder="अहिंसा, मानवता, नैतिक शिक्षा, संस्कार..."
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Publication & Language */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
              सामग्री भाषा (Language)
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
                हिंदी
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

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/video')}
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
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Video'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
