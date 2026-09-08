import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminFileUpload } from '../../components/admin/AdminFileUpload';
import { useData } from '../../context/DataContext';

interface AdminFounderScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminFounderScreen: React.FC<AdminFounderScreenProps> = ({ onNavigate }) => {
  const { data, updateFounder } = useData();
  const [name, setName] = useState(data.founder.name);
  const [title, setTitle] = useState(data.founder.title);
  const [photoUrl, setPhotoUrl] = useState(data.founder.photoUrl);
  const [quote, setQuote] = useState(data.founder.quote || '');
  const [bio, setBio] = useState(data.founder.bio);
  const [message, setMessage] = useState(data.founder.message);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError('कृपया संस्थापक का नाम दर्ज करें।');
      return;
    }

    updateFounder({
      name: name.trim(),
      title: title.trim(),
      photoUrl,
      quote: quote.trim(),
      bio: bio.trim(),
      message: message.trim(),
    });

    setFeedback('संस्थापक परिचय पृष्ठ की जानकारी सफलतापूर्वक अपडेट हो गई!');
    setError(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title="संस्थापक परिचय प्रबंधन (Founder CMS)"
        subtitle="‘संस्थापक परिचय’ पृष्ठ का विवरण, चित्र एवं संदेश प्रबंधित करें"
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/founder'),
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
        {/* Name & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="founder-name" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              संस्थापक / मार्गदर्शक का नाम <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
              <input
                id="founder-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आचार्य विद्यानंद"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="founder-title" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              पदवी / सम्मान (Title / Role)
            </label>
            <input
              id="founder-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="संस्थापक एवं मुख्य प्रेरक"
              className="w-full px-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <AdminFileUpload
          id="founder-photo-upload"
          label="संस्थापक छायाचित्र (Founder Portrait / Photo)"
          accept="image/*"
          type="image"
          currentUrl={photoUrl}
          currentFileName="founder_portrait.jpg"
          hint="पोर्ट्रेट तस्वीर (JPG/PNG/WebP) सेलेक्ट करें"
          onFileSelect={(info) => setPhotoUrl(info.previewUrl)}
          onClear={() => setPhotoUrl('')}
        />

        {/* Quote / Slogan */}
        <div>
          <label htmlFor="founder-quote" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            प्रमुख उद्धरण / विचार सूत्र (Featured Quote)
          </label>
          <input
            id="founder-quote"
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="“अहिंसा केवल एक सिद्धांत नहीं, बल्कि जीने की एक पवित्र शैली है।”"
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="founder-bio" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            जीवन परिचय एवं साधना (Biography & Journey)
          </label>
          <textarea
            id="founder-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white leading-relaxed"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="founder-msg" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            मानवता के नाम संदेश (Message to Humanity)
          </label>
          <textarea
            id="founder-msg"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            <span>संस्थापक विवरण सेव करें</span>
          </button>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
