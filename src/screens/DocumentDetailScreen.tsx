import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  DocumentCard,
  CardActionRow,
  Divider,
  EmptyState,
} from '../components';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Check,
  BookOpen,
  FileCheck,
  ExternalLink,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface DocumentDetailScreenProps {
  id?: string;
  onBack: () => void;
  onNavigateToDocument: (id: string) => void;
}

export const DocumentDetailScreen: React.FC<DocumentDetailScreenProps> = ({
  id = '1',
  onBack,
  onNavigateToDocument,
}) => {
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { getDocumentById, getPublishedDocuments } = useData();

  const doc = getDocumentById(id);

  if (!doc) {
    return (
      <PageContainer>
        <div className="pt-2 pb-3">
          <BackButton onBack={onBack} label="वापस" />
        </div>
        <EmptyState
          title="यह सामग्री उपलब्ध नहीं है।"
          description="यह दस्तावेज उपलब्ध नहीं है या हटा दिया गया है।"
          actionText="वापस जाएं"
          onAction={onBack}
        />
      </PageContainer>
    );
  }

  const relatedDocuments = getPublishedDocuments()
    .filter((d) => d.id !== id)
    .slice(0, 3);

  const handleDownload = () => {
    if (doc.pdfUrl) {
      // Direct file download
      const link = document.createElement('a');
      link.href = doc.pdfUrl;
      link.download = doc.fileName || `${doc.title}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setActionNotice('दस्तावेज डाउनलोड प्रारंभ हो गया है।');
    } else {
      // Fallback text download
      const textContent = `${doc.title}\n\nविवरण:\n${doc.description}\n\nसारांश:\n${doc.summary}\n\nअध्याय सूची:\n${(doc.chapters || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nअहिंसा शिक्षा मिशन`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionNotice('दस्तावेज सामग्री डाउनलोड हो गई है।');
    }

    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `📄 ${doc.title}\n${doc.description}\n\nअहिंसा शिक्षा मिशन: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // noop
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // noop
      }
    }
  };

  return (
    <PageContainer>
      {/* 1. Top Navigation */}
      <div className="pt-1 pb-2 flex items-center justify-between">
        <BackButton onBack={onBack} label="वापस" />
      </div>

      {/* 2. Document Content Area */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#16325C] dark:text-[#93C5FD] bg-[#EEF3FA] dark:bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#16325C]/10 dark:border-blue-800/40">
            {doc.typeLabel || '📄 दस्तावेज'}
          </span>
          <DateLabel date={doc.date} />
        </div>

        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] dark:text-white leading-snug tracking-tight">
          {doc.title}
        </h1>

        {/* Description */}
        {doc.description && (
          <p className="text-[15px] text-[#1F2421] dark:text-gray-200 leading-relaxed">
            {doc.description}
          </p>
        )}

        {/* Interactive PDF Document Viewer */}
        {doc.pdfUrl ? (
          <div
            className={`w-full bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xs my-1 transition-all ${
              isFullScreen ? 'fixed inset-4 z-50 overflow-auto bg-white dark:bg-[#0F172A] shadow-2xl' : ''
            }`}
          >
            {/* Viewer Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DF] dark:border-[#334155] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-[11px]">
                  PDF
                </div>
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-bold text-[#16325C] dark:text-white line-clamp-1">
                    {doc.fileName || `${doc.title}.pdf`}
                  </span>
                  <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400">
                    {doc.pages ? `${doc.pages} पृष्ठ • ` : ''}{doc.fileSize || 'PDF'}
                  </span>
                </div>
              </div>

              {/* Quick toolbar */}
              <div className="flex items-center gap-1.5">
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-2.5 bg-white dark:bg-slate-800 hover:bg-[#EEF3FA] text-[#16325C] dark:text-gray-200 border border-[#D2D8E0] dark:border-slate-700 rounded-lg text-[12px] font-medium flex items-center gap-1 transition-colors"
                  title="नए टैब में खोलें"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">नए टैब में खोलें</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="h-8 px-2.5 bg-white dark:bg-slate-800 hover:bg-[#EEF3FA] text-[#16325C] dark:text-gray-200 border border-[#D2D8E0] dark:border-slate-700 rounded-lg text-[12px] font-medium flex items-center gap-1 transition-colors"
                  title={isFullScreen ? 'छोटा करें' : 'फुल स्क्रीन'}
                >
                  {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
              </div>
            </div>

            {/* IFrame Embedded PDF */}
            <div className="relative w-full rounded-xl overflow-hidden border border-[#D2D8E0] dark:border-slate-700 bg-white">
              <iframe
                src={`${doc.pdfUrl}#toolbar=1&navpanes=0`}
                title={doc.title}
                className={`w-full ${isFullScreen ? 'h-[75vh]' : 'h-[440px] sm:h-[540px]'} border-0`}
              />
            </div>
          </div>
        ) : (
          /* Clean PDF Preview Placeholder for legacy text documents */
          <div className="w-full bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xs my-1 relative overflow-hidden">
            <div className="w-24 h-32 bg-white dark:bg-slate-800 border border-[#D2D8E0] dark:border-slate-700 rounded-lg shadow-sm flex flex-col items-center justify-center p-3 relative">
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#FAF8F5] dark:bg-[#0F172A] border-b border-l border-[#D2D8E0] dark:border-slate-700 rounded-bl" />
              <FileText size={36} className="text-[#16325C] dark:text-[#93C5FD] mb-1.5" />
              <span className="text-[10px] font-mono font-bold text-[#16325C] dark:text-[#93C5FD] tracking-wider uppercase">
                दस्तावेज
              </span>
            </div>

            <div className="mt-3.5 flex flex-col items-center gap-1">
              <span className="text-[14px] font-semibold text-[#16325C] dark:text-white">
                {doc.title}
              </span>
              <div className="flex items-center gap-2 text-[12px] text-[#5C6773] dark:text-gray-400">
                <span>{doc.pages || '१०'} पृष्ठ</span>
                <span>•</span>
                <span>{doc.fileSize || '१.५ MB'}</span>
                <span>•</span>
                <span>{doc.fileType || 'PDF'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons: 'दस्तावेज देखें / खोलें' and 'डाउनलोड करें ↓' */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {doc.pdfUrl ? (
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[46px] px-3 bg-white dark:bg-[#1E293B] hover:bg-[#FAF8F5] dark:hover:bg-[#334155] text-[#16325C] dark:text-white border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-2xs"
            >
              <Eye size={16} />
              <span>दस्तावेज देखें</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setActionNotice('दस्तावेज सारांश और विवरण नीचे उपलब्ध है।')}
              className="h-[46px] px-3 bg-white dark:bg-[#1E293B] hover:bg-[#FAF8F5] dark:hover:bg-[#334155] text-[#16325C] dark:text-white border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-2xs"
            >
              <Eye size={16} />
              <span>दस्तावेज देखें</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="h-[46px] px-3 bg-[#16325C] dark:bg-[#254B85] hover:bg-[#0F2342] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-xs"
          >
            <Download size={16} />
            <span>डाउनलोड करें ↓</span>
          </button>
        </div>

        {/* Notice feedback banner */}
        {actionNotice && (
          <div className="bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#2E7D32]/25 dark:border-emerald-800 rounded-xl p-3 text-[13px] text-[#1B5E20] dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <FileCheck size={16} className="text-[#2E7D32] dark:text-emerald-400 shrink-0" />
              {actionNotice}
            </span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-[12px] font-bold text-[#2E7D32] dark:text-emerald-400 underline ml-2 cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        )}

        {/* Document Summary & Chapters */}
        {(doc.summary || (doc.chapters && doc.chapters.length > 0)) && (
          <div className="bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-xl p-4 flex flex-col gap-2.5 mt-2">
            <div className="flex items-center gap-1.5 text-[#16325C] dark:text-white font-semibold text-[14px]">
              <BookOpen size={16} className="text-[#2E7D32] dark:text-emerald-400" />
              <span>दस्तावेज सारांश</span>
            </div>

            {doc.summary && (
              <p className="text-[14px] text-[#5C6773] dark:text-gray-300 leading-relaxed">
                {doc.summary}
              </p>
            )}

            {doc.chapters && doc.chapters.length > 0 && (
              <div className="pt-2 border-t border-[#E8E5DF]/70 dark:border-slate-700 flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-[#16325C] dark:text-gray-200">
                  प्रमुख अध्याय / विषय सूची:
                </span>
                <ul className="flex flex-col gap-1 text-[13px] text-[#5C6773] dark:text-gray-300">
                  {doc.chapters.map((ch, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16325C]/40 dark:bg-blue-400" />
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Share & Like Action Row */}
        <div className="pt-3 border-t border-[#E8E5DF] dark:border-[#334155] mt-1">
          <CardActionRow
            contentId={doc.id}
            contentType="document"
            contentTitle={doc.title}
            title={doc.title}
            text={`📄 ${doc.title}\n${doc.description || ''}`}
          />
        </div>
      </div>

      {/* 3. Related Documents: अन्य दस्तावेज */}
      <section className="mt-6 mb-6 flex flex-col gap-3">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[16px] font-bold text-[#16325C] dark:text-white tracking-tight">
            अन्य दस्तावेज
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedDocuments.map((rel) => (
            <DocumentCard
              key={rel.id}
              id={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              description={rel.description}
              date={rel.date}
              fileType={rel.fileType}
              fileSize={rel.fileSize}
              pages={rel.pages}
              onRead={() => {
                window.scrollTo(0, 0);
                onNavigateToDocument(rel.id);
              }}
              onDownload={() => {
                window.scrollTo(0, 0);
                onNavigateToDocument(rel.id);
              }}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
};
