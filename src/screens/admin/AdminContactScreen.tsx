import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PageContainer, Footer } from '../../components';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useData } from '../../context/DataContext';

interface AdminContactScreenProps {
  onNavigate: (path: string) => void;
}

export const AdminContactScreen: React.FC<AdminContactScreenProps> = ({ onNavigate }) => {
  const { data, updateContact } = useData();
  const [email, setEmail] = useState(data.contact.email);
  const [phone, setPhone] = useState(data.contact.phone);
  const [address, setAddress] = useState(data.contact.address);
  const [officeHours, setOfficeHours] = useState(data.contact.officeHours);
  const [guidance, setGuidance] = useState(data.contact.guidance);
  const [note, setNote] = useState(data.contact.note || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(data.contact.mapEmbedUrl || '');

  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!email.trim() || !phone.trim()) {
      setError('कृपया ईमेल और फोन नंबर अवश्य दर्ज करें।');
      return;
    }

    updateContact({
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      officeHours: officeHours.trim(),
      guidance: guidance.trim(),
      note: note.trim(),
      mapEmbedUrl: mapEmbedUrl.trim(),
    });

    setFeedback('संपर्क जानकारी सफलतापूर्वक अपडेट हो गई!');
    setError(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <PageContainer>
      <AdminPageHeader
        title="संपर्क जानकारी प्रबंधन (Contact CMS)"
        subtitle="आश्रम संपर्क सूत्र, पता, कार्य समय और मार्गदर्शन निर्देश प्रबंधित करें"
        onBack={() => onNavigate('/admin')}
        backLabel="Admin Dashboard"
        secondaryAction={{
          label: 'Public View',
          onClick: () => onNavigate('/contact'),
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
        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              ईमेल पता (Email Address) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@ahimsashiksha.org"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              फोन / हेल्पलाइन नंबर (Phone Number) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
              <input
                id="contact-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="contact-addr" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            कार्यालय / आश्रम का पता (Postal Address)
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-3 text-[#8C96A3]" />
            <textarea
              id="contact-addr"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="अहिंसा शिक्षा मिशन, गांधी अध्ययन केंद्र परिसर..."
              className="w-full pl-9 pr-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Office Hours */}
        <div>
          <label htmlFor="contact-hours" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            कार्यालय समय (Office / Visiting Hours)
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A3]" />
            <input
              id="contact-hours"
              type="text"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              placeholder="प्रातः ९:०० से सायं ६:०० बजे तक (सोमवार से शनिवार)"
              className="w-full pl-9 pr-3.5 py-2 text-[13.5px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Guidance and Inquiries notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-guidance" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              मार्गदर्शन परामर्श निर्देश (Guidance Note)
            </label>
            <textarea
              id="contact-guidance"
              rows={3}
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="आध्यात्मिक व नैतिक मार्गदर्शन हेतु पूर्व सूचना देकर आएं..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="contact-note" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
              अतिरिक्त सूचना / विनम्र निवेदन (Important Note)
            </label>
            <textarea
              id="contact-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="हम गैर-व्यावसायिक संगठन हैं, सभी सेवाएं निःशुल्क हैं..."
              className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
            />
          </div>
        </div>

        {/* Map Embed URL */}
        <div>
          <label htmlFor="contact-map" className="block text-[13px] font-bold text-[#1F2421] dark:text-gray-200 mb-1">
            गूगल मैप्स एम्बेड लिंक (Google Maps Embed URL / Optional)
          </label>
          <input
            id="contact-map"
            type="text"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E8E5DF] dark:border-[#334155] rounded-xl text-[#1F2421] dark:text-white"
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
            <span>संपर्क विवरण अपडेट करें</span>
          </button>
        </div>
      </div>

      <Footer />
    </PageContainer>
  );
};
