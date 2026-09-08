import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { useData } from '../../context/DataContext';
import { AudioItem } from '../../lib/adminStore';

interface AdminAudioFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminAudioFormScreen: React.FC<AdminAudioFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addAudio, updateAudio, getAudioById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getAudioById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [speaker, setSpeaker] = useState(existingItem?.speaker || 'आचार्य विद्यानंद');
  const [duration, setDuration] = useState(existingItem?.duration || '०४:१५');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [aboutText, setAboutText] = useState(existingItem?.aboutText || '');
  const [fileName, setFileName] = useState(existingItem?.fileName || '');
  const [fileSize, setFileSize] = useState(existingItem?.fileSize || '३.२ MB');
  const [audioUrl, setAudioUrl] = useState(existingItem?.audioUrl || '');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setSpeaker(existingItem.speaker);
      setDuration(existingItem.duration);
      setDescription(existingItem.description);
      setAboutText(existingItem.aboutText);
      setFileName(existingItem.fileName || '');
      setFileSize(existingItem.fileSize || '');
      setAudioUrl(existingItem.audioUrl || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया ऑडियो का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    const itemPayload: Partial<AudioItem> = {
      title: title.trim(),
      speaker: speaker.trim() || 'अहिंसा शिक्षा मिशन',
      duration: duration.trim() || '०३:३०',
      description: description.trim() || 'ऑडियो संदेश विवरण',
      aboutText: aboutText.trim() || description.trim(),
      fileName: fileName.trim() || 'audio_track.mp3',
      fileSize: fileSize.trim() || '२.५ MB',
      fileType: 'audio/mpeg',
      audioUrl: audioUrl.trim(),
      language,
      status: saveStatus,
    };

    if (isEdit && id) {
      updateAudio(id, itemPayload);
      setSuccess('ऑडियो संदेश सफलतापूर्वक अपडेट हो गया!');
    } else {
      addAudio(itemPayload);
      setSuccess('नया ऑडियो संदेश सफलतापूर्वक जोड़ दिया गया!');
    }

    setTimeout(() => {
      onNavigate('/admin/audio');
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'ऑडियो संपादित करें (Edit Audio)' : 'नया ऑडियो संदेश जोड़ें (Add Audio)'}
        subtitle={isEdit ? `ID: ${id}` : 'ऑडियो प्रवचन या संदेश जोड़ें'}
        onBack={() => onNavigate('/admin/audio')}
        backLabel="Audio List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/audio/${id}`),
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
          <label htmlFor="audio-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            ऑडियो शीर्षक (Audio Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="audio-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. अहिंसा का अर्थ केवल हिंसा न करना नहीं है..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Speaker & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="audio-speaker" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              वक्ता / मार्गदर्शक (Speaker)
            </label>
            <input
              id="audio-speaker"
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="आचार्य विद्यानंद..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="audio-duration" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              अवधि (Duration)
            </label>
            <input
              id="audio-duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="०३:३० (MM:SS)"
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Audio File Selector */}
        <AdminFileUpload
          id="audio-file-upload"
          label="ऑडियो फ़ाइल (Audio File Selection)"
          accept="audio/*"
          type="audio"
          currentUrl={audioUrl}
          currentFileName={fileName || 'audio_sample.mp3'}
          currentFileSize={fileSize}
          hint="MP3, WAV या AAC ऑडियो फ़ाइल सेलेक्ट करें"
          onFileSelect={(info) => {
            setFileName(info.fileName);
            setFileSize(info.fileSize);
            setAudioUrl(info.previewUrl);
          }}
          onClear={() => {
            setFileName('');
            setFileSize('');
            setAudioUrl('');
          }}
        />

        {/* Description */}
        <div>
          <label htmlFor="audio-desc" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            संक्षिप्त विवरण (Short Description)
          </label>
          <textarea
            id="audio-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ऑडियो संदेश का मुख्य बिंदु..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* About this Audio Detailed Text */}
        <div>
          <label htmlFor="audio-about" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            विस्तृत जानकारी (About this Audio / Context)
          </label>
          <textarea
            id="audio-about"
            rows={4}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="इस प्रवचन/संदेश के संदर्भ और मुख्य शिक्षाओं का विस्तृत विवरण..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
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
            onClick={() => onNavigate('/admin/audio')}
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
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
