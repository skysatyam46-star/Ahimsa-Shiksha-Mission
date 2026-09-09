import React, { useRef, useState } from 'react';
import { Upload, File, Image as ImageIcon, Headphones, FileText, CheckCircle, X } from 'lucide-react';

interface AdminFileUploadProps {
  id?: string;
  label: string;
  accept?: string;
  type?: 'image' | 'audio' | 'document';
  currentUrl?: string;
  currentFileName?: string;
  currentFileSize?: string;
  hint?: string;
  onFileSelect: (fileInfo: {
    fileName: string;
    fileSize: string;
    fileType: string;
    previewUrl: string;
  }) => void;
  onClear?: () => void;
}

export const AdminFileUpload: React.FC<AdminFileUploadProps> = ({
  id = 'file-upload',
  label,
  accept = '*',
  type = 'document',
  currentUrl,
  currentFileName,
  currentFileSize,
  hint,
  onFileSelect,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
    previewUrl: string;
  } | null>(
    currentFileName || currentUrl
      ? {
          fileName: currentFileName || 'Existing file',
          fileSize: currentFileSize || 'Local reference',
          fileType: type === 'image' ? 'image/jpeg' : type === 'audio' ? 'audio/mpeg' : 'application/pdf',
          previewUrl: currentUrl || '',
        }
      : null
  );

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    // Validation for image uploads
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        alert('कृपया वैध फोटो फ़ाइल (JPG, PNG, WebP या GIF) ही चुनें।');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('इमेज साइज़ 10MB से कम होना चाहिए।');
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      const meta = {
        fileName: file.name,
        fileSize: formatBytes(file.size),
        fileType: file.type || (type === 'image' ? 'image/jpeg' : type === 'audio' ? 'audio/mpeg' : 'application/pdf'),
        previewUrl,
      };
      setSelectedMeta(meta);
      onFileSelect(meta);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeta(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) onClear();
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200">
        {label}
      </label>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedMeta ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          className={`w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
            isDragging
              ? 'border-[#16325C] bg-[#EEF3FA] dark:bg-slate-800'
              : 'border-[#D1D5DB] dark:border-[#475569] bg-[#FAF8F5] dark:bg-[#0F172A] hover:border-[#16325C]/50 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] flex items-center justify-center">
            {type === 'image' && <ImageIcon size={20} />}
            {type === 'audio' && <Headphones size={20} />}
            {type === 'document' && <FileText size={20} />}
          </div>
          <div>
            <span className="text-[13px] font-bold text-[#16325C] dark:text-[#93C5FD]">
              File Select Karein
            </span>
            <span className="text-[12px] text-[#5C6773] dark:text-gray-400 block">
              ya file ko yahan drag & drop karein
            </span>
          </div>
          {hint && (
            <span className="text-[11px] text-[#8C96A3] dark:text-gray-400">
              {hint}
            </span>
          )}
        </div>
      ) : (
        <div className="p-3 bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#2E7D32] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.2 rounded">
                    File Selected
                  </span>
                  <span className="text-[11px] text-[#8C96A3]">{selectedMeta.fileSize}</span>
                </div>
                <p className="text-[13px] font-semibold text-[#1F2421] dark:text-white truncate">
                  {selectedMeta.fileName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-[11px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-slate-800 rounded-lg hover:bg-[#E2ECF8] transition-colors tap-active"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Visual Previews */}
          {type === 'image' && selectedMeta.previewUrl && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-[#E8E5DF] dark:border-[#334155]">
              <img
                src={selectedMeta.previewUrl}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {type === 'audio' && selectedMeta.previewUrl && (
            <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] space-y-1.5">
              <audio controls src={selectedMeta.previewUrl} className="w-full h-8" />
              <p className="text-[11px] text-[#8C5D07] dark:text-amber-400 font-medium">
                नोट: यह स्थानीय ऑडियो फ़ाइल का पूर्वावलोकन है। स्थायी क्लाउड ऑडियो स्टोरेज इंटीग्रेशन आगामी चरण में उपलब्ध होगा।
              </p>
            </div>
          )}

          {type === 'document' && (
            <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] space-y-1">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2421] dark:text-gray-200">
                <FileText size={16} className="text-[#DC2626]" />
                <span>PDF दस्तावेज तैयार है ({selectedMeta.fileSize})</span>
              </div>
              <p className="text-[11px] text-[#8C5D07] dark:text-amber-400 font-medium">
                नोट: यह स्थानीय PDF फ़ाइल का पूर्वावलोकन है। स्थायी क्लाउड PDF स्टोरेज इंटीग्रेशन आगामी चरण में उपलब्ध होगा।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
