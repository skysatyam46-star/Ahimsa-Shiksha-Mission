import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { ExpandedTextEditor, ExpandButton } from '../../components/admin/ExpandedTextEditor';
import { useData, getAdminAuthHeaders } from '../../context/DataContext';
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
  const [speaker] = useState(existingItem?.speaker || 'अहिंसा शिक्षा मिशन');
  const [duration] = useState(existingItem?.duration || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [aboutText] = useState(existingItem?.aboutText || '');
  const [fileName, setFileName] = useState(existingItem?.fileName || '');
  const [fileSize, setFileSize] = useState(existingItem?.fileSize || '');
  const [audioUrl, setAudioUrl] = useState(existingItem?.audioUrl || '');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [audioFileId, setAudioFileId] = useState(existingItem?.audioFileId || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Expanded Editor State
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (isEdit && existingItem) {
      setTitle(existingItem.title || '');
      setDescription(existingItem.description || '');
      setFileName(existingItem.fileName || '');
      setFileSize(existingItem.fileSize || '');
      setAudioUrl(existingItem.audioUrl || '');
      setAudioFileId(existingItem.audioFileId || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    } else if (!isEdit) {
      setTitle('');
      setDescription('');
      setFileName('');
      setFileSize('');
      setAudioUrl('');
      setAudioFileId('');
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
      setError('कृपया ऑडियो का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    if (!audioUrl) {
      setError('कृपया ऑडियो फ़ाइल अवश्य चुनें/अपलोड करें।');
      return;
    }

    let finalAudioUrl = audioUrl;
    let finalAudioFileId = audioFileId || existingItem?.audioFileId;

    // Upload to our generic backend upload-file endpoint if it's a local/preview file
    if (audioUrl.startsWith('data:') || audioUrl.startsWith('blob:')) {
      setIsUploading(true);
      try {
        const uploadRes = await fetch('/api/admin/upload-file', {
          method: 'POST',
          headers: getAdminAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            file: audioUrl,
            fileName: fileName || `audio_${Date.now()}.mp3`,
            type: 'audio',
          }),
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'ऑडियो फ़ाइल अपलोड करने में विफलता हुई।');
        }

        finalAudioUrl = uploadData.url;
        finalAudioFileId = uploadData.fileId;
        setAudioUrl(finalAudioUrl);
        setAudioFileId(finalAudioFileId);
      } catch (err: any) {
        setIsUploading(false);
        setError(err?.message || 'ऑडियो फ़ाइल सर्वर पर अपलोड नहीं हो सकी।');
        return;
      }
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
      audioUrl: finalAudioUrl,
      audioFileId: finalAudioFileId,
      language,
      status: saveStatus,
    };

    try {
      setIsUploading(true);
      if (isEdit && id) {
        await updateAudio(id, itemPayload);
        setSuccess('ऑडियो संदेश सफलतापूर्वक अपडेट और डेटाबेस में सुरक्षित हो गया!');
      } else {
        await addAudio(itemPayload);
        setSuccess('नया ऑडियो संदेश सफलतापूर्वक प्रकाशित और डेटाबेस में सुरक्षित हो गया!');
      }

      setTimeout(() => {
        onNavigate('/admin/audio');
      }, 800);
    } catch (err: any) {
      setIsUploading(false);
      setError(err?.message || 'डेटाबेस में सहेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'ऑडियो संपादित करें' : 'नया ऑडियो जोड़ें'}
        subtitle={isEdit ? 'विवरण बदलें' : 'ऑडियो फ़ाइल अपलोड करके प्रकाशित करें'}
        onBack={() => onNavigate('/admin/audio')}
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
          <label htmlFor="audio-title" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            ऑडियो का शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            id="audio-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ऑडियो का नाम लिखें…"
            className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2. Audio File Selection */}
        <AdminFileUpload
          id="audio-file-upload"
          label="ऑडियो फ़ाइल *"
          accept="audio/*"
          type="audio"
          currentUrl={audioUrl}
          currentFileName={fileName}
          currentFileSize={fileSize}
          hint="MP3 या WAV ऑडियो फ़ाइल चुनें"
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

        {/* 3. Description (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="audio-desc" className="text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200">
              संक्षिप्त विवरण (वैकल्पिक)
            </label>
            <ExpandButton onClick={() => setIsDescriptionExpanded(true)} />
          </div>
          <textarea
            id="audio-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ऑडियो संदेश के बारे में लिखें…"
            className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/audio')}
            className="min-h-[44px] px-5 py-2 text-[13.5px] font-semibold text-[#5C6773] dark:text-gray-300 bg-[#F0ECE1] dark:bg-slate-700 hover:bg-[#E8E2D8] rounded-xl transition-colors tap-active order-2 sm:order-1"
          >
            रद्द करें
          </button>

          <div className="flex items-center justify-end gap-2.5 order-1 sm:order-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => handleSave('draft')}
              className="min-h-[44px] px-3.5 py-2 text-[12px] font-medium text-[#8C5D07] dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100/80 rounded-xl transition-colors tap-active disabled:opacity-50"
            >
              ड्राफ्ट में रखें
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => handleSave('published')}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-6 py-2 text-[14px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] rounded-xl transition-colors shadow-xs tap-active flex-1 sm:flex-initial disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>अपलोड हो रहा है...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>ऑडियो प्रकाशित करें</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Text Editor Modal */}
      {isDescriptionExpanded && (
        <ExpandedTextEditor
          isOpen={isDescriptionExpanded}
          onClose={() => setIsDescriptionExpanded(false)}
          title="ऑडियो संदेश का विवरण"
          value={description}
          onChange={(newVal) => setDescription(newVal)}
        />
      )}

      <Footer />
    </PageContainer>
  );
};
