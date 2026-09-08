import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { useData } from '../../context/DataContext';
import { DocumentItem } from '../../lib/adminStore';

interface AdminDocumentFormScreenProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const AdminDocumentFormScreen: React.FC<AdminDocumentFormScreenProps> = ({
  id,
  onNavigate,
}) => {
  const { addDocument, updateDocument, getDocumentById } = useData();
  const isEdit = Boolean(id && id !== 'new');

  const existingItem = isEdit && id ? getDocumentById(id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [pages, setPages] = useState(existingItem?.pages || '१२');
  const [fileSize, setFileSize] = useState(existingItem?.fileSize || '१.८ MB');
  const [fileName, setFileName] = useState(existingItem?.fileName || 'document.pdf');
  const [summary, setSummary] = useState(existingItem?.summary || '');
  const [chaptersInput, setChaptersInput] = useState(
    existingItem?.chapters?.join('\n') || '१. प्रस्तावना\n२. अहिंसा का दार्शनिक आधार\n३. निष्कर्ष'
  );
  const [pdfUrl, setPdfUrl] = useState(existingItem?.pdfUrl || '');
  const [language, setLanguage] = useState<'hi' | 'en'>(existingItem?.language || 'hi');
  const [status, setStatus] = useState<'published' | 'draft'>(existingItem?.status || 'published');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setDescription(existingItem.description);
      setPages(existingItem.pages);
      setFileSize(existingItem.fileSize);
      setFileName(existingItem.fileName || 'document.pdf');
      setSummary(existingItem.summary);
      setChaptersInput(existingItem.chapters?.join('\n') || '');
      setPdfUrl(existingItem.pdfUrl || '');
      setLanguage(existingItem.language || 'hi');
      setStatus(existingItem.status || 'published');
    }
  }, [existingItem]);

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    setError(null);
    const saveStatus = targetStatus || status;

    if (!title.trim()) {
      setError('कृपया दस्तावेज का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    const chapters = chaptersInput
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const itemPayload: Partial<DocumentItem> = {
      title: title.trim(),
      description: description.trim() || 'दस्तावेज विवरण',
      pages: pages.trim() || '१०',
      fileSize: fileSize.trim() || '१.५ MB',
      fileType: 'PDF',
      fileName: fileName.trim() || 'document.pdf',
      summary: summary.trim() || description.trim(),
      chapters,
      pdfUrl: pdfUrl.trim(),
      language,
      status: saveStatus,
    };

    if (isEdit && id) {
      updateDocument(id, itemPayload);
      setSuccess('दस्तावेज सफलतापूर्वक अपडेट हो गया!');
    } else {
      addDocument(itemPayload);
      setSuccess('नया दस्तावेज सफलतापूर्वक जोड़ दिया गया!');
    }

    setTimeout(() => {
      onNavigate('/admin/document');
    }, 1000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title={isEdit ? 'दस्तावेज संपादित करें (Edit Document)' : 'नया दस्तावेज जोड़ें (Add Document)'}
        subtitle={isEdit ? `ID: ${id}` : 'अध्ययन सामग्री या PDF मार्गदर्शिका जोड़ें'}
        onBack={() => onNavigate('/admin/document')}
        backLabel="Document List"
        secondaryAction={
          isEdit && status === 'published'
            ? {
                label: 'Public View',
                onClick: () => onNavigate(`/document/${id}`),
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
          <label htmlFor="doc-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            दस्तावेज शीर्षक (Document Title) <span className="text-red-500">*</span>
          </label>
          <input
            id="doc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="उदा. अहिंसा शिक्षा मिशन — परिचय एवं नियमावली..."
            className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* PDF File Selector */}
        <AdminFileUpload
          id="doc-file-upload"
          label="PDF फ़ाइल चयन (PDF File Selection)"
          accept=".pdf,application/pdf"
          type="document"
          currentUrl={pdfUrl}
          currentFileName={fileName}
          currentFileSize={fileSize}
          hint="PDF दस्तावेज सेलेक्ट करें"
          onFileSelect={(info) => {
            setFileName(info.fileName);
            setFileSize(info.fileSize);
            setPdfUrl(info.previewUrl);
          }}
          onClear={() => {
            setFileName('');
            setFileSize('');
            setPdfUrl('');
          }}
        />

        {/* Pages & File Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="doc-pages" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              पृष्ठ संख्या (Pages Count)
            </label>
            <input
              id="doc-pages"
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="उदा. १६ पृष्ठ"
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="doc-size" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
              फ़ाइल का आकार (File Size Display)
            </label>
            <input
              id="doc-size"
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="उदा. २.४ MB"
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="doc-desc" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            संक्षिप्त परिचय (Description)
          </label>
          <textarea
            id="doc-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="इस PDF दस्तावेज का मुख्य उद्देश्य और विषय..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Detailed Summary */}
        <div>
          <label htmlFor="doc-summary" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            दस्तावेज सारांश (Detailed Summary)
          </label>
          <textarea
            id="doc-summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="दस्तावेज के मुख्य निष्कर्ष और पाठकों के लिए लाभ..."
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#16325C] dark:focus:border-[#93C5FD] text-[#1F2421] dark:text-white placeholder-[#8C96A3]"
          />
        </div>

        {/* Chapter outline */}
        <div>
          <label htmlFor="doc-chapters" className="block text-[13px] font-semibold text-[#1F2421] dark:text-gray-200 mb-1">
            अध्याय सूची / मुख्य अनुभाग (Chapters / Index Outline - Line by line)
          </label>
          <textarea
            id="doc-chapters"
            rows={4}
            value={chaptersInput}
            onChange={(e) => setChaptersInput(e.target.value)}
            placeholder="१. अध्याय १&#10;२. अध्याय २..."
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
            onClick={() => onNavigate('/admin/document')}
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
              <span>{isEdit ? 'Changes Save Karein' : 'Publish Document'}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
