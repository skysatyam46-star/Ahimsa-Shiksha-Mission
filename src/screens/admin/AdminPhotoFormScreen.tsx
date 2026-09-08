import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { useData } from '../../context/DataContext';
import { PhotoItem } from '../../lib/adminStore';
import { peacefulAshramPhoto } from '../../data/homeFeed';

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
  const [description, setDescription] = useState(existingItem?.description || '');
  const [location, setLocation] = useState(existingItem?.location || 'गांधी अध्ययन केंद्र परिसर');
  const [imageUrl, setImageUrl] = useState(existingItem?.imageUrl || peacefulAshramPhoto);
  const [fileName, setFileName] = useState(existingItem ? 'photo_image.jpg' : '');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setCaption(existingItem.caption);
      setDescription(existingItem.description);
      setLocation(existingItem.location || '');
      setImageUrl(existingItem.imageUrl || peacefulAshramPhoto);
      setStatus(existingItem.status || 'published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
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

    const itemPayload: Partial<PhotoItem> = {
      title: title.trim(),
      caption: caption.trim() || title.trim(),
      description: description.trim() || caption.trim(),
      location: location.trim() || 'मिशन परिसर',
      imageUrl,
      status: saveStatus,
    };

    if (isEdit && id) {
      updatePhoto(id, itemPayload);
      setSuccess('फोटो सफलतापूर्वक अपडेट हो गई!');
    } else {
      addPhoto(itemPayload);
      setSuccess('नई फोटो सफलतापूर्वक जोड़ दी गई!');
    }

    setTimeout(() => {
      onNavigate('/admin/photo');
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'फोटो संपादित करें (Edit Photo)' : 'नई फोटो जोड़ें (Add Photo)'}
        subtitle={isEdit ? `ID: ${id}` : 'मिशन गतिविधि या आयोजन की तस्वीर जोड़ें'}
        onBack={() => onNavigate('/admin/photo')}
        backLabel="Photo List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/photo/${id}`),
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
          <label htmlFor="photo-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            फोटो शीर्षक (Photo Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="photo-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. शांति व सद्भाव पदयात्रा, गांधी अध्ययन केंद्र..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Photo Upload / Selection */}
        <AdminFileUpload
          id="photo-image-upload"
          label="फोटो फ़ाइल (Photo File Selection)"
          accept="image/*"
          type="image"
          currentUrl={imageUrl}
          currentFileName={fileName || 'mission_photo.jpg'}
          currentFileSize="1.2 MB"
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

        {/* Caption & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="photo-caption" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              कैप्शन (Caption)
            </label>
            <input
              id="photo-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="फोटो के नीचे दिखने वाला संक्षिप्त विवरण..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="photo-loc" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              स्थान (Location / Venue)
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
              <input
                id="photo-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="उदा. मुख्य आश्रम परिसर, नई दिल्ली..."
                className="w-full pl-9 pr-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="photo-desc" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            विस्तृत संदर्भ (Detailed Description)
          </label>
          <textarea
            id="photo-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="इस कार्यक्रम या आयोजन के बारे में विस्तृत विवरण..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Publication */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[13px] font-bold text-[#1F2421] dark:text-gray-200 block">
              प्रकाशन स्थिति (Status)
            </span>
            <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400">
              Draft तस्वीरें सार्वजनिक गैलरी में प्रदर्शित नहीं होंगी
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
            onClick={() => onNavigate('/admin/photo')}
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
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Photo'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
