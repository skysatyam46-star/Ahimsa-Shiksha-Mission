import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Database,
  Globe,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useData } from '../../context/DataContext';

interface AdminSettingsScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({ onNavigate }) => {
  const { data, resetToSeedData, restoreData } = useData();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReset = () => {
    resetToSeedData();
    setShowResetConfirm(false);
    showToast('सभी डेटा फ़ैक्टरी डिफ़ॉल्ट (Initial Seed) पर रीसेट हो गया है!');
  };

  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ahimsa_mission_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CMS डेटा बैकअप JSON फ़ाइल डाउनलोड हो गई!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.vichar && parsed.videos && parsed.audio) {
          restoreData(parsed);
          showToast('बैकअप डेटा सफलतापूर्वक रीस्टोर हो गया!');
        } else {
          alert('अमान्य बैकअप फ़ाइल: आवश्यक फ़ील्ड्स नहीं मिले।');
        }
      } catch (err) {
        alert('फ़ाइल पढ़ने में त्रुटि: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title="वेबसाइट व सीएमएस सेटिंग्स (Website Settings)"
        subtitle="लोकल स्टोरेज स्थिति, बैकअप एक्सपोर्ट/इम्पोर्ट एवं डिफ़ॉल्ट डेटा रीसेट"
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
      />

      {feedback && (
        <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Prototype Storage Status Card */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF3FA] dark:bg-slate-800 text-[#16325C] dark:text-[#93C5FD] flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-[14.5px] font-bold text-[#1F2421] dark:text-white">
                लोकल डेटाबेस एवं स्टोरेज स्थिति (Local CMS Store)
              </h3>
              <p className="text-[12px] text-[#5C6773] dark:text-gray-400">
                Phase 5C: डेटा सीधे आपके ब्राउज़र के LocalStorage में सुरक्षित रूप से सहेजा जा रहा है
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">विचार संदेश</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.vichar.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">वीडियो</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.videos.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">ऑडियो प्रवचन</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.audio.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">तस्वीरें (Photos)</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.photos.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">दस्तावेज (PDFs)</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.documents.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">सूचनाएँ</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.notices.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">महत्वपूर्ण लिंक</span>
              <span className="text-[18px] font-bold text-[#1F2421] dark:text-white">{data.links.length}</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155]">
              <span className="text-[11.5px] text-[#5C6773] dark:text-gray-400 block font-medium">वर्जन</span>
              <span className="text-[18px] font-bold text-[#16325C] dark:text-[#93C5FD]">v{data.version}</span>
            </div>
          </div>
        </div>

        {/* Backup & Restore Card */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] dark:bg-slate-800 text-[#8C5D07] dark:text-amber-400 flex items-center justify-center">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-[14.5px] font-bold text-[#1F2421] dark:text-white">
                डेटा बैकअप एवं रीस्टोर (Backup & Restore)
              </h3>
              <p className="text-[12px] text-[#5C6773] dark:text-gray-400">
                आप अपनी सभी जोड़ी गई सामग्री को JSON प्रारूप में सुरक्षित डाउनलोड या पुनः अपलोड कर सकते हैं
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16325C] hover:bg-[#1B3C6E] text-white text-[13px] font-bold rounded-xl transition-colors tap-active"
            >
              <Download size={15} />
              <span>डाउनलोड JSON बैकअप (Export Backup)</span>
            </button>

            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF8F5] dark:bg-slate-800 hover:bg-[#EAE6DF] text-[#1F2421] dark:text-white border border-[#E8E5DF] dark:border-slate-700 text-[13px] font-semibold rounded-xl transition-colors cursor-pointer tap-active">
              <Upload size={15} />
              <span>रीस्टोर बैकअप फ़ाइल (Import JSON)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone: Factory Reset */}
        <div className="bg-white dark:bg-[#1E293B] border border-red-200 dark:border-red-900/60 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-[14.5px] font-bold text-red-700 dark:text-red-400">
                डिफ़ॉल्ट डेटा रीसेट (Reset to Seed Data)
              </h3>
              <p className="text-[12px] text-[#5C6773] dark:text-gray-400">
                यदि आप सभी बदलाव हटाकर मूल डेमो डेटा वापस लोड करना चाहते हैं
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12.5px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors tap-active"
            >
              <RotateCcw size={14} />
              <span>मूल डेटा पर रीसेट करें (Reset All Content)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E8E5DF] dark:border-[#334155] space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-[16px] font-bold text-[#1F2421] dark:text-white">
                क्या आप वाकई सारा डेटा रीसेट करना चाहते हैं?
              </h3>
              <p className="text-[13px] text-[#5C6773] dark:text-gray-300 mt-1.5 leading-relaxed">
                इस क्रिया से आपके द्वारा जोड़े गए सभी नए विचार, वीडियो, ऑडियो, फ़ोटो व बदलाव हट जाएंगे और मूल डेमो डेटा पुनः लोड हो जाएगा।
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold text-[#5C6773] dark:text-gray-300 bg-[#FAF8F5] dark:bg-slate-800 hover:bg-[#EAE6DF] transition-colors"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
              >
                हाँ, रीसेट करें
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </PageContainer>
  );
};
