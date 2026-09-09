import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, MapPin, Loader2 } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { useData, getAdminAuthHeaders } from '../../context/DataContext';
import { PhotoItem } from '../../lib/adminStore';

interface AdminPhotoFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminPhotoFormScreen: React.FC<AdminPhotoFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addPhoto, updatePhoto, getPhotoById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getPhotoById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [caption, setCaption] = useState(existingItem?.caption || '');
  const [description] = useState(existingItem?.description || '');
  const [location, setLocation] = useState(existingItem?.location || '');
  const [imageUrl, setImageUrl] = useState(existingItem?.imageUrl || '');
  const [imageFileId, setImageFileId] = useState(existingItem?.imageFileId || '');
  const [fileName, setFileName] = useState(existingItem?.title ? 'photo.jpg' : '');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && existingItem) {
      setTitle(existingItem.title || '');
      setCaption(existingItem.caption || '');
      setLocation(existingItem.location || '');
      setImageUrl(existingItem.imageUrl || '');
      setImageFileId(existingItem.imageFileId || '');
      setStatus(existingItem.status || 'published');
    } else if (!isEdit) {
      setTitle('');
      setCaption('');
      setLocation('');
      setImageUrl('');
      setImageFileId('');
      setStatus('published');
      setError(null);
      setSuccess(null);
    }
  }, [id, isEdit, existingItem]);

  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया फोटो का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    if (!imageUrl) {
      setError('कृपया फोटो सेलेक्ट करें।');
      return;
    }

    let finalImageUrl = imageUrl;
    let finalFileId = imageFileId || existingItem?.imageFileId;

    // Upload to ImageKit if it's a new local image (data URL or blob)
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      setIsUploading(true);
      try {
        const uploadRes = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: getAdminAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            file: imageUrl,
            fileName: fileName || `photo_${Date.now()}.jpg`,
          }),
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'फोटो अपलोड करने में विफलता हुई।');
        }

        const oldFileId = existingItem?.imageFileId;
        finalImageUrl = uploadData.url;
        finalFileId = uploadData.fileId;

        // Clean up old ImageKit asset if photo was replaced
        if (oldFileId && oldFileId !== finalFileId) {
          fetch('/api/admin/delete-image', {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ fileId: oldFileId }),
          }).catch((err) => console.error('[PhotoForm] Failed to delete old ImageKit asset:', err));
        }
      } catch (err: any) {
        setIsUploading(false);
        setError(err?.message || 'फोटो इमेज किट पर अपलोड नहीं हो सकी।');
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const itemPayload: Partial<PhotoItem> = {
      title: title.trim(),
      caption: caption.trim() || title.trim(),
      description: description.trim() || caption.trim(),
      location: location.trim() || 'मिशन परिसर',
      imageUrl: finalImageUrl,
      imageFileId: finalFileId,
      status: saveStatus,
    };

    try {
      if (isEdit && id) {
        await updatePhoto(id, itemPayload);
        setSuccess('फोटो सफलतापूर्वक अपडेट और डेटाबेस में सुरक्षित हो गई!');
      } else {
        await addPhoto(itemPayload);
        setSuccess('नई फोटो सफलतापूर्वक प्रकाशित और डेटाबेस में सुरक्षित हो गई!');
      }

      setTimeout(() => {
        onNavigate('/admin/photo');
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'डेटाबेस में सहेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'फोटो संपादित करें' : 'नई फोटो जोड़ें'}
        subtitle={isEdit ? 'विवरण बदलें' : 'तस्वीर अपलोड करके प्रकाशित करें'}
        onBack={() => onNavigate('/admin/photo')}
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
          <label htmlFor="photo-title" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
            फोटो का शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            id="photo-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="फोटो का नाम लिखें…"
            className="w-full px-3.5 py-2.5 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* 2. Photo File Upload */}
        <AdminFileUpload
          id="photo-image-upload"
          label="फोटो चुनें *"
          accept="image/*"
          type="image"
          currentUrl={imageUrl}
          currentFileName={fileName}
          hint="JPG, PNG या WebP इमेज सेलेक्ट करें"
          onFileSelect={(info) => {
            setFileName(info.fileName);
            setImageUrl(info.previewUrl);
          }}
          onClear={() => {
            setFileName('');
            setImageUrl('');
          }}
        />

        {/* 3. Caption & 4. Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="photo-caption" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
              कैप्शन (वैकल्पिक)
            </label>
            <input
              id="photo-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="फोटो का संक्षिप्त कैप्शन लिखें…"
              className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
            />
          </div>

          <div>
            <label htmlFor="photo-loc" className="block text-[13.5px] font-bold text-[#1F2421] dark:text-gray-200 mb-1.5">
              स्थान (वैकल्पिक)
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
              <input
                id="photo-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="स्थान का नाम लिखें…"
                className="w-full pl-9 pr-3.5 py-2.5 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E5DF] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => onNavigate('/admin/photo')}
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
                  <span>तस्वीर अपलोड हो रही है...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>फोटो प्रकाशित करें</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
