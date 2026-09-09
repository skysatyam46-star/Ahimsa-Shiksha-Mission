import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useData } from '../../context/DataContext';

interface AdminMissionScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminMissionScreen: React.FC<AdminMissionScreenProps> = ({ onNavigate }) => {
  const { data, updateMission } = useData();
  const [title, setTitle] = useState(data.mission.title);
  const [subtitle, setSubtitle] = useState(data.mission.subtitle);
  const [objective, setObjective] = useState(data.mission.objective);
  const [philosophy, setPhilosophy] = useState(data.mission.philosophy);
  const [effort, setEffort] = useState(data.mission.effort);
  const [corePillarsInput, setCorePillarsInput] = useState(
    data.mission.corePillars ? data.mission.corePillars.join('\n') : ''
  );
  const [additionalInfo, setAdditionalInfo] = useState(data.mission.additionalInfo || '');

  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!objective.trim()) {
      setError('कृपया मुख्य उद्देश्य (Objective) दर्ज करें।');
      return;
    }

    const corePillars = corePillarsInput
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    try {
      await updateMission({
        title: title.trim(),
        subtitle: subtitle.trim(),
        objective: objective.trim(),
        philosophy: philosophy.trim(),
        effort: effort.trim(),
        corePillars,
        additionalInfo: additionalInfo.trim(),
      });

      setFeedback('मिशन पृष्ठ की जानकारी सफलतापूर्वक अपडेट और सुरक्षित हो गई!');
      setError(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'डेटाबेस में सहेजने में विफल।');
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title="मिशन जानकारी प्रबंधन (Mission CMS)"
        subtitle="‘हमारा उद्देश्य’ पृष्ठ की सामग्री और दर्शन को प्रबंधित करें"
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/mission'),
        }}
      />

      {feedback && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-[13px] font-medium flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] border border-[#E8E5DF] dark:border-[#334155] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Heading & Subheading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mission-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              पृष्ठ मुख्य शीर्षक (Main Title)
            </label>
            <input
              id="mission-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अहिंसा शिक्षा मिशन"
              className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="mission-sub" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              उप-शीर्षक (Subtitle)
            </label>
            <input
              id="mission-sub"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="मानवता, करुणा एवं नैतिक मूल्यों का प्रसार"
              className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Section 1: Objective */}
        <div>
          <label htmlFor="mission-obj" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            १. हमारा मुख्य उद्देश्य (Objective) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="mission-obj"
            rows={3}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white leading-relaxed"
          />
        </div>

        {/* Section 2: Philosophy */}
        <div>
          <label htmlFor="mission-philo" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            २. दार्शनिक आधार (Philosophy & Vision)
          </label>
          <textarea
            id="mission-philo"
            rows={3}
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white leading-relaxed"
          />
        </div>

        {/* Section 3: Effort */}
        <div>
          <label htmlFor="mission-effort" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            ३. हमारा विनम्र प्रयास (Our Effort & Mission Work)
          </label>
          <textarea
            id="mission-effort"
            rows={3}
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white leading-relaxed"
          />
        </div>

        {/* Section 4: Pillars */}
        <div>
          <label htmlFor="mission-pillars" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            ४. मुख्य स्तंभ (Core Pillars - Line by line)
          </label>
          <textarea
            id="mission-pillars"
            rows={4}
            value={corePillarsInput}
            onChange={(e) => setCorePillarsInput(e.target.value)}
            placeholder="१. नैतिक शिक्षा&#10;२. जीव दया एवं पर्यावरण..."
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Section 5: Additional Info */}
        <div>
          <label htmlFor="mission-add" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            ५. अतिरिक्त संदर्भ / सूचना (Additional Notes)
          </label>
          <textarea
            id="mission-add"
            rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 text-[13.5px] font-bold text-white bg-[#16325C] dark:bg-[#254B85] hover:bg-[#1B3C6E] rounded-xl transition-colors shadow-xs tap-active"
          >
            <Save size={16} />
            <span>मिशन जानकारी अपडेट करें</span>
          </button>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
