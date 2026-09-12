import React, { useRef, useState } from 'react';
import { Upload, File, Image as ImageIcon, Headphones, FileText, CheckCircle, X, ZoomIn } from 'lucide-react';
import { ImageZoomModal } from '../ui/ImageZoomModal';

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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
    previewUrl: string;
    originalSize?: string;
    compressedSize?: string;
    reductionPercent?: string;
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

  const compressImage = (file: File): Promise<{
    previewUrl: string;
    compressedSizeStr: string;
    originalSizeStr: string;
    reductionPercentStr: string;
  }> => {
    return new Promise((resolve, reject) => {
      const originalSizeBytes = file.size;
      const originalSizeStr = formatBytes(originalSizeBytes);

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        // Maximum dimensions: 1920px on the longest side
        const maxDim = 1920;
        let width = img.width;
        let height = img.height;

        // Preserve aspect ratio and do not upscale small images
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('कैनवास संदर्भ (Canvas Context) प्राप्त करने में असमर्थ।'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Set quality dynamically
        let quality = 0.82;
        if (originalSizeBytes < 400 * 1024 && img.width <= maxDim && img.height <= maxDim) {
          // If the image is already small and optimized, don't degrade it unnecessarily
          quality = 0.90;
        }

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate compressed size from Base64
        const base64Content = compressedDataUrl.substring(compressedDataUrl.indexOf(',') + 1);
        const compressedSizeBytes = Math.round((base64Content.length * 3) / 4);
        const compressedSizeStr = formatBytes(compressedSizeBytes);

        const reductionPercent = originalSizeBytes > 0
          ? Math.max(0, Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100))
          : 0;
        const reductionPercentStr = `लगभग ${reductionPercent}% कम`;

        resolve({
          previewUrl: compressedDataUrl,
          compressedSizeStr,
          originalSizeStr,
          reductionPercentStr,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('इमेज लोड करने में असमर्थ। कृपया सत्यापित करें कि फ़ाइल एक वैध छवि है।'));
      };

      img.src = objectUrl;
    });
  };

  const processFile = async (file: File) => {
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

      try {
        const result = await compressImage(file);
        const meta = {
          fileName: file.name,
          fileSize: result.compressedSizeStr,
          fileType: 'image/jpeg',
          previewUrl: result.previewUrl,
          originalSize: result.originalSizeStr,
          compressedSize: result.compressedSizeStr,
          reductionPercent: result.reductionPercentStr,
        };
        setSelectedMeta(meta);
        onFileSelect(meta);
      } catch (err: any) {
        console.error('Compression failed:', err);
        alert(err?.message || 'इमेज कंप्रेस करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      }
      return;
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
            <>
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative w-full h-40 rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-[#E8E5DF] dark:border-[#334155] cursor-pointer group"
                title="फोटो को बड़ा करके देखने के लिए क्लिक करें"
              >
                <img
                  src={selectedMeta.previewUrl}
                  alt="Selected preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-[12.5px] backdrop-blur-[2px]">
                  <ZoomIn size={18} />
                  <span>ज़ूम करके देखें</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                  <ZoomIn size={12} />
                  <span>ज़ूम</span>
                </div>
              </div>

              <ImageZoomModal
                isOpen={isZoomOpen}
                imageUrl={selectedMeta.previewUrl}
                title={selectedMeta.fileName}
                caption="अपलोड की गई फ़ाइल का पूर्वावलोकन"
                onClose={() => setIsZoomOpen(false)}
              />

              {/* Compression stats */}
              {selectedMeta.compressedSize && (
                <div className="mt-2.5 p-3 bg-emerald-50/55 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-center justify-between text-[13px] font-medium text-emerald-800 dark:text-emerald-300">
                  <div className="space-y-0.5">
                    <div>Original: <span className="font-bold">{selectedMeta.originalSize}</span></div>
                    <div>Compressed: <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedMeta.compressedSize}</span></div>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-900/60 text-[#2E7D32] dark:text-emerald-300 px-2.5 py-1 rounded-lg font-extrabold text-[12px]">
                    {selectedMeta.reductionPercent}
                  </span>
                </div>
              )}
            </>
          )}

          {type === 'audio' && selectedMeta.previewUrl && (
            <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] space-y-1.5">
              <audio controls src={selectedMeta.previewUrl} className="w-full h-8" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                यह ऑडियो फ़ाइल का पूर्वावलोकन है। प्रकाशन के समय यह सुरक्षित रूप से सर्वर पर अपलोड की जाएगी।
              </p>
            </div>
          )}

          {type === 'document' && (
            <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] space-y-1">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2421] dark:text-gray-200">
                <FileText size={16} className="text-[#DC2626]" />
                <span>PDF दस्तावेज तैयार है ({selectedMeta.fileSize})</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                यह PDF दस्तावेज का पूर्वावलोकन है। प्रकाशन के समय यह सुरक्षित रूप से सर्वर पर अपलोड किया जाएगा।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
