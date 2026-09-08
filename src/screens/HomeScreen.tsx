import React from 'react';
import {
  PageContainer,
  MessageCard,
  VideoCard,
  AudioCard,
  PhotoCard,
  DocumentCard,
  NoticeCard,
  ShareButton,
  Footer,
} from '../components';
import {
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  peacefulSunThumbnail,
  peacefulAshramPhoto,
  satyagrahaThumbnail,
  workshopPhoto,
} from '../data/homeFeed';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onNavigateToTab: (tabId: 'vichar' | 'video' | 'samagri' | 'khoj') => void;
  onNavigateToRoute?: (path: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onNavigateToRoute,
}) => {
  const { t } = useApp();

  const navigate = (path: string, fallbackTab: 'vichar' | 'video' | 'samagri' | 'khoj') => {
    if (onNavigateToRoute) {
      onNavigateToRoute(path);
    } else {
      onNavigateToTab(fallbackTab);
    }
  };
  return (
    <PageContainer>
      {/* 3. Welcome Section: Compact peaceful greeting */}
      <section
        id="welcome-section"
        className="pt-1 pb-3 flex flex-col gap-1 border-b border-[#E8E5DF]/70 mb-4"
      >
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[#16325C] tracking-tight leading-snug">
          {t.welcomeTitle}
        </h2>
        <p className="text-[13px] font-medium text-[#2E7D32] tracking-wide">
          {t.brandTagline}
        </p>
        <p className="text-[14px] text-[#5C6773] leading-relaxed mt-0.5">
          {t.welcomeSubtitle}
        </p>
      </section>

      {/* 4. Search Shortcut */}
      <div
        id="home-search-shortcut"
        role="button"
        tabIndex={0}
        onClick={() => onNavigateToTab('khoj')}
        aria-label="खोजें: विचार, वीडियो और सामग्री"
        className="w-full h-[48px] bg-white border border-[#E8E5DF] rounded-[12px] px-3.5 flex items-center gap-2.5 text-[#5C6773] text-[14px] cursor-pointer hover:border-[#16325C]/30 hover:bg-[#FAF8F5]/60 transition-colors shadow-2xs tap-active mb-5"
      >
        <Search size={18} className="text-[#5C6773] shrink-0" />
        <span className="truncate text-[14px]">
          {t.searchPlaceholder}
        </span>
      </div>

      {/* 5. Main Feed Heading */}
      <div className="flex items-center justify-between mb-3.5 px-0.5">
        <h3 className="text-[17px] font-bold text-[#16325C] tracking-tight">
          {t.newestFirst}
        </h3>
        <button
          type="button"
          onClick={() => onNavigateToTab('vichar')}
          className="text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] flex items-center gap-1 transition-colors tap-active"
        >
          <span>{t.viewAll}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 6. Mixed Chronological Content Feed */}
      <div className="flex flex-col gap-3.5">
        {/* Item 1: 7 सितंबर 2026 — Message Card */}
        <MessageCard
          typeLabel="📝 संदेश"
          title="अहिंसा का वास्तविक अर्थ"
          date="7 सितंबर 2026"
          content="अहिंसा केवल हिंसा से दूर रहना नहीं, बल्कि अपने विचार, वचन और कर्म में सभी के प्रति सद्भाव रखना है..."
          author="अहिंसा शिक्षा मिशन"
          onReadMore={() => navigate('/vichar/1', 'vichar')}
        />

        {/* Item 2: 6 सितंबर 2026 — Video Card */}
        <VideoCard
          typeLabel="🎥 वीडियो"
          title="अहिंसा और मानवता पर विचार"
          date="6 सितंबर 2026"
          duration="१४:२०"
          speaker="आचार्य विद्यानंद"
          thumbnailUrl={peacefulSunThumbnail}
          onClick={() => navigate('/video/1', 'video')}
        />

        {/* Item 3: 5 सितंबर 2026 — Audio Card */}
        <AudioCard
          typeLabel="🎧 ऑडियो संदेश"
          title="मानवता पर विशेष संदेश"
          date="5 सितंबर 2026"
          speaker="सत्य प्रकाश जी"
          duration="०२:३५"
          currentTime="०१:१४"
          progressPercent={48}
          onOpen={() => navigate('/audio/1', 'samagri')}
        />

        {/* Item 4: 4 सितंबर 2026 — Photo Card */}
        <PhotoCard
          typeLabel="🖼️ फोटो"
          title="मिशन की एक झलक"
          date="4 सितंबर 2026"
          caption="सत्य और शांति के वातावरण में आयोजित विचार गोष्ठी का एक पावन दृश्य।"
          imageUrl={peacefulAshramPhoto}
          onViewPhoto={() => navigate('/photo/1', 'samagri')}
        />

        {/* Item 5: 3 सितंबर 2026 — Document Card */}
        <DocumentCard
          typeLabel="📄 दस्तावेज"
          title="शिक्षा और अहिंसा"
          description="अहिंसा एवं शिक्षा से संबंधित विशेष सामग्री।"
          date="3 सितंबर 2026"
          fileType="PDF"
          fileSize="१.८ MB"
          pages="१६"
          onRead={() => navigate('/document/1', 'samagri')}
          onDownload={() => navigate('/document/1', 'samagri')}
        />

        {/* Item 6: 2 सितंबर 2026 — Notice Card */}
        <NoticeCard
          typeLabel="📢 सूचना"
          title="आगामी कार्यक्रम की जानकारी"
          date="2 सितंबर 2026"
          message="मिशन से संबंधित आगामी कार्यक्रम और आवश्यक जानकारी। आगामी १५ सितंबर को आयोजित होने वाली शांति संगोष्ठी में आप सादर आमंत्रित हैं।"
          actionText="पूरी सूचना →"
          onAction={() => navigate('/notice/1', 'samagri')}
          variant="blue"
        />

        {/* Item 7: 1 सितंबर 2026 — Message Card (Continuing the feed) */}
        <MessageCard
          typeLabel="📝 संदेश"
          title="सत्य और आंतरिक शांति"
          date="1 सितंबर 2026"
          content="सत्य की राह में कठिनाइयाँ हो सकती हैं, किंतु वही मार्ग आत्मा को निर्भय और स्थिर बनाता है। जहाँ भय नहीं, वहीं वास्तविक शांति है।"
          author="महात्मा गांधी"
          source="सत्य के प्रयोग से"
          onReadMore={() => navigate('/vichar/2', 'vichar')}
        />

        {/* Item 8: 31 अगस्त 2026 — Video Card */}
        <VideoCard
          typeLabel="🎥 वीडियो"
          title="गांधी जी और अहिंसात्मक सत्याग्रह"
          date="31 अगस्त 2026"
          duration="१८:४५"
          speaker="डॉ. रवींद्र कुमार"
          thumbnailUrl={satyagrahaThumbnail}
          onClick={() => navigate('/video/2', 'video')}
        />

        {/* 14. Mission Introduction: Compact Mission Card */}
        <div
          id="mission-intro-card"
          className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-4.5 my-1 flex flex-col gap-2.5 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            <h4 className="text-[16px] font-bold text-[#16325C] tracking-tight">
              हमारा मिशन
            </h4>
          </div>

          <p className="text-[14px] text-[#5C6773] leading-relaxed">
            अहिंसा, शिक्षा, सत्य और मानवता के विचारों को लोगों तक पहुँचाना।
          </p>

          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={() => onNavigateToTab('vichar')}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors tap-active"
            >
              <span>और जानें</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 15. Today's Thought: Featured Thought Card */}
        <div
          id="todays-thought-card"
          className="w-full bg-linear-to-b from-[#FEFBF6] to-[#FAF6EE] border border-[#D97706]/25 rounded-2xl p-4.5 my-1 flex flex-col gap-3 relative overflow-hidden shadow-2xs"
        >
          {/* Subtle golden accent header */}
          <div className="flex items-center justify-between gap-2 border-b border-[#D97706]/15 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <h4 className="text-[14px] font-bold text-[#8B4513] tracking-tight flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D97706]" />
                आज का विचार
              </h4>
            </div>
            <span className="text-[11px] font-medium text-[#B45309] bg-[#FEF3C7]/70 px-2 py-0.5 rounded-md border border-[#FDE68A]">
              दैनिक प्रेरणा
            </span>
          </div>

          <blockquote className="text-[16px] text-[#1F2421] font-medium leading-[1.65] my-0.5">
            “अच्छे विचार तभी सार्थक होते हैं, जब वे हमारे जीवन का हिस्सा बनते हैं।”
          </blockquote>

          <div className="flex items-center justify-between pt-1 border-t border-[#D97706]/15 mt-auto">
            <span className="text-[13px] font-semibold text-[#8B4513]">
              — अहिंसा शिक्षा मिशन
            </span>

            <ShareButton
              title="आज का विचार - अहिंसा शिक्षा मिशन"
              text="“अच्छे विचार तभी सार्थक होते हैं, जब वे हमारे जीवन का हिस्सा बनते हैं।”\n— अहिंसा शिक्षा मिशन"
            />
          </div>
        </div>

        {/* 16. More Older Content */}
        {/* Item 9: 29 अगस्त 2026 — Photo Card */}
        <PhotoCard
          typeLabel="🖼️ फोटो"
          title="गांधी अध्ययन केंद्र में विचार गोष्ठी"
          date="29 अगस्त 2026"
          caption="युवाओं के साथ अहिंसा, चरित्र निर्माण और सामाजिक सद्भाव पर सामूहिक परिचर्चा।"
          imageUrl={workshopPhoto}
          onViewPhoto={() => navigate('/photo/2', 'samagri')}
        />

        {/* Item 10: 27 अगस्त 2026 — Document Card */}
        <DocumentCard
          typeLabel="📄 दस्तावेज"
          title="नैतिक शिक्षा व जीवन मूल्य मार्गदर्शिका"
          description="युवा पीढ़ी के लिए मानवीय मूल्यों और सद्भाव पर आधारित अध्ययन सामग्री।"
          date="27 अगस्त 2026"
          fileType="PDF"
          fileSize="२.४ MB"
          pages="२४"
          onRead={() => navigate('/document/2', 'samagri')}
          onDownload={() => navigate('/document/2', 'samagri')}
        />

        {/* Visual Button: और पुरानी सामग्री देखें → */}
        <div className="pt-2 pb-1">
          <button
            type="button"
            onClick={() => onNavigateToTab('vichar')}
            className="w-full py-3 px-4 bg-white hover:bg-[#EEF3FA] text-[#16325C] border border-[#E8E5DF] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors tap-active shadow-2xs"
          >
            <span>और पुरानी सामग्री देखें</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 17. Minimal Phase 1 Footer */}
      <Footer />
    </PageContainer>
  );
};
