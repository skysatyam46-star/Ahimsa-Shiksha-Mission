import React, { useState } from 'react';
import {
  PageContainer,
  BackButton,
  DateLabel,
  DocumentCard,
  Divider,
  Footer,
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
} from 'lucide-react';
import { mockDocuments } from '../data/mockContent';

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

  const doc = mockDocuments[id];

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

  const relatedDocuments = Object.values(mockDocuments).filter((d) => d.id !== id).slice(0, 3);

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
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#16325C] bg-[#EEF3FA] px-2.5 py-0.5 rounded-md">
            {doc.typeLabel}
          </span>
          <DateLabel date={doc.date} />
        </div>

        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] leading-snug tracking-tight">
          {doc.title}
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[#1F2421] leading-relaxed">
          {doc.description}
        </p>

        {/* Clean PDF Preview Placeholder (Exact prompt layout pattern) */}
        <div className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xs my-1 relative overflow-hidden">
          {/* Subtle document decorative sheet effect */}
          <div className="w-24 h-32 bg-white border border-[#D2D8E0] rounded-lg shadow-sm flex flex-col items-center justify-center p-3 relative">
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#FAF8F5] border-b border-l border-[#D2D8E0] rounded-bl" />
            <FileText size={36} className="text-[#16325C] mb-1.5" />
            <span className="text-[10px] font-mono font-bold text-[#16325C] tracking-wider uppercase">
              PDF PREVIEW
            </span>
          </div>

          <div className="mt-3.5 flex flex-col items-center gap-1">
            <span className="text-[14px] font-semibold text-[#16325C]">
              {doc.title}.pdf
            </span>
            <div className="flex items-center gap-2 text-[12px] text-[#5C6773]">
              <span>{doc.pages} पृष्ठ</span>
              <span>•</span>
              <span>{doc.fileSize}</span>
              <span>•</span>
              <span>{doc.fileType}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: 'दस्तावेज देखें' and 'डाउनलोड करें ↓' */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setActionNotice('दस्तावेज पूर्वावलोकन प्रोटोटाइप में लोड हो रहा है...')}
            className="h-[46px] px-3 bg-white hover:bg-[#FAF8F5] text-[#16325C] border border-[#E8E5DF] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-2xs"
          >
            <Eye size={16} />
            <span>दस्तावेज देखें</span>
          </button>

          <button
            type="button"
            onClick={() => setActionNotice('दस्तावेज डाउनलोडिंग प्रारंभ हो रही है...')}
            className="h-[46px] px-3 bg-[#16325C] hover:bg-[#0F2342] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-xs"
          >
            <Download size={16} />
            <span>डाउनलोड करें ↓</span>
          </button>
        </div>

        {/* Notice feedback banner */}
        {actionNotice && (
          <div className="bg-[#F0FDF4] border border-[#2E7D32]/25 rounded-xl p-3 text-[13px] text-[#1B5E20] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileCheck size={16} className="text-[#2E7D32] shrink-0" />
              {actionNotice}
            </span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-[12px] font-bold text-[#2E7D32] underline ml-2"
            >
              बंद करें
            </button>
          </div>
        )}

        {/* Document Summary & Chapters */}
        <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-4 flex flex-col gap-2.5 mt-2">
          <div className="flex items-center gap-1.5 text-[#16325C] font-semibold text-[14px]">
            <BookOpen size={16} className="text-[#2E7D32]" />
            <span>दस्तावेज सारांश</span>
          </div>

          <p className="text-[14px] text-[#5C6773] leading-relaxed">
            {doc.summary}
          </p>

          {doc.chapters && doc.chapters.length > 0 && (
            <div className="pt-2 border-t border-[#E8E5DF]/70 flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#16325C]">
                प्रमुख अध्याय / विषय सूची:
              </span>
              <ul className="flex flex-col gap-1 text-[13px] text-[#5C6773]">
                {doc.chapters.map((ch, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16325C]/40" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Share Action */}
        <div className="pt-3 pb-2 border-t border-[#E8E5DF] mt-2 flex items-center justify-between">
          <span className="text-[14px] text-[#5C6773]">
            यह दस्तावेज साझा करें
          </span>

          <button
            type="button"
            onClick={handleShare}
            aria-label="साझा करें"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-medium transition-colors tap-active min-h-[44px] shadow-2xs ${
              copied
                ? 'bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20'
                : 'bg-white text-[#16325C] hover:bg-[#FAF8F5] border border-[#E8E5DF]'
            }`}
          >
            {copied ? <Check size={16} className="text-[#2E7D32]" /> : <Share2 size={15} />}
            <span>{copied ? 'कॉपी हो गया' : '↗ साझा करें'}</span>
          </button>
        </div>
      </div>

      {/* 3. Related Documents: अन्य दस्तावेज */}
      <section className="mt-6 mb-6 flex flex-col gap-3.5">
        <Divider />
        <div className="flex items-center justify-between px-0.5 pt-1">
          <h2 className="text-[17px] font-bold text-[#16325C] tracking-tight">
            अन्य दस्तावेज
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {relatedDocuments.map((rel) => (
            <DocumentCard
              key={rel.id}
              typeLabel={rel.typeLabel}
              title={rel.title}
              description={rel.description}
              date={rel.date}
              fileType={rel.fileType}
              fileSize={rel.fileSize}
              pages={rel.pages}
              onRead={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToDocument(rel.id);
              }}
              onDownload={() => setActionNotice(`दस्तावेज (${rel.title}) डाउनलोड हो रहा है...`)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
