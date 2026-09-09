import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'en';
export type Theme = 'light' | 'dark';

export interface Translations {
  // Navigation (Bottom Nav)
  navHome: string;
  navVichar: string;
  navVideo: string;
  navSamagri: string;
  navKhoj: string;

  // Header & Brand
  brandTitle: string;
  brandTagline: string;
  settingsHeaderTitle: string;
  settingsSubtitle: string;

  // Common UI Actions
  back: string;
  viewAll: string;
  viewMore: string;
  readMore: string;
  listen: string;
  pause: string;
  download: string;
  share: string;
  copied: string;
  searchPlaceholder: string;
  totalCount: string;
  newestFirst: string;
  seeAllContent: string;

  // Settings Screen
  appearanceSection: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;

  languageSection: string;
  languageLabel: string;
  languageNote: string;

  infoSection: string;
  missionTitle: string;
  missionDesc: string;
  founderTitle: string;
  founderDesc: string;
  contactTitle: string;
  contactDesc: string;
  linksTitle: string;
  linksDesc: string;

  adminSection: string;
  adminTitle: string;
  adminDesc: string;

  // Home Screen UI
  welcomeTitle: string;
  welcomeSubtitle: string;
  quoteOfDayTitle: string;
  latestVideosTitle: string;
  audioMessagesTitle: string;
  quickCategoriesTitle: string;

  // Vichar Screen UI
  vicharTitle: string;
  vicharSubtitle: string;
  allFilter: string;

  // Video Screen UI
  videoTitle: string;
  videoSubtitle: string;

  // Samagri Screen UI
  samagriTitle: string;
  samagriSubtitle: string;

  // Khoj Screen UI
  khojTitle: string;
  khojSubtitle: string;

  // Mission Screen
  missionHeading: string;
  missionSubheading: string;
  ourObjectiveTitle: string;
  ourObjectiveText: string;
  ourPhilosophyTitle: string;
  ourPhilosophyText: string;
  ourEffortTitle: string;
  ourEffortText: string;
  corePillarsTitle: string;

  // Founder Screen
  founderHeading: string;
  founderSubheading: string;
  founderName: string;
  founderRole: string;
  founderBioTitle: string;
  founderBioPlaceholder: string;
  founderMessageTitle: string;
  founderMessagePlaceholder: string;
  placeholderNotice: string;

  // Contact Screen
  contactHeading: string;
  contactSubheading: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  callButton: string;
  emailButton: string;
  mockContactNotice: string;

  // Important Links Screen
  linksHeading: string;
  linksSubheading: string;
  officialWebsite: string;
  officialWebsiteDesc: string;
  youtubeChannel: string;
  youtubeChannelDesc: string;
  socialCommunity: string;
  socialCommunityDesc: string;
  studyResources: string;
  studyResourcesDesc: string;
  openLink: string;

  // Empty States
  emptyHomeTitle: string;
  emptyHomeDesc: string;
  emptyHomeAction: string;
  emptyVicharTitle: string;
  emptyVicharDesc: string;
  emptyVideoTitle: string;
  emptyVideoDesc: string;
  emptyAudioTitle: string;
  emptyAudioDesc: string;
  emptyPhotoTitle: string;
  emptyPhotoDesc: string;
  emptyDocTitle: string;
  emptyDocDesc: string;
  emptyNoticeTitle: string;
  emptyNoticeDesc: string;
  emptySearchTitle: string;
  emptySearchDesc: string;
  emptyRecentTitle: string;
  emptyLinksTitle: string;
  emptyLinksDesc: string;
  emptyFounderTitle: string;
  emptyFounderDesc: string;
  emptyContactTitle: string;
  emptyContactDesc: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  hi: {
    navHome: 'होम',
    navVichar: 'विचार',
    navVideo: 'वीडियो',
    navSamagri: 'सामग्री',
    navKhoj: 'खोज',

    brandTitle: 'अहिंसा शिक्षा मिशन',
    brandTagline: 'सत्य • अहिंसा • शिक्षा • मानवता',
    settingsHeaderTitle: 'सेटिंग्स',
    settingsSubtitle: 'ऐप प्राथमिकताएँ और मिशन की जानकारी',

    back: 'पीछे',
    viewAll: 'सभी देखें',
    viewMore: 'और देखें',
    readMore: 'पूरा पढ़ें',
    listen: 'सुनें',
    pause: 'रोकें',
    download: 'डाउनलोड',
    share: 'साझा करें',
    copied: 'लिंक कॉपी हो गया',
    searchPlaceholder: 'खोज करें... (अहिंसा, सत्य, शिक्षा)',
    totalCount: 'कुल',
    newestFirst: 'नवीनतम पहले',
    seeAllContent: 'सभी सामग्री देखें',

    appearanceSection: 'रूप-रंग',
    themeLabel: 'थीम',
    themeLight: '☀️ लाइट',
    themeDark: '🌙 डार्क',

    languageSection: 'भाषा',
    languageLabel: 'भाषा',
    languageNote: 'प्रकाशित सामग्री अपनी मूल भाषा में ही रहेगी।',

    infoSection: 'जानकारी',
    missionTitle: 'मिशन',
    missionDesc: 'उद्देश्य और विचार',
    founderTitle: 'संस्थापक',
    founderDesc: 'संस्थापक का परिचय और संदेश',
    contactTitle: 'संपर्क',
    contactDesc: 'संपर्क माध्यम और विवरण',
    linksTitle: 'महत्वपूर्ण लिंक',
    linksDesc: 'उपयोगी लिंक और स्रोत',

    adminSection: 'प्रशासन',
    adminTitle: 'एडमिन पैनल',
    adminDesc: 'मिशन वेबसाइट प्रबंधित करने के लिए',

    welcomeTitle: 'अहिंसा शिक्षा मिशन में आपका स्वागत है',
    welcomeSubtitle: 'सत्य, अहिंसा और शांति के विचार',
    quoteOfDayTitle: 'आज का विचार',
    latestVideosTitle: 'नवीनतम वीडियो',
    audioMessagesTitle: 'ऑडियो संदेश',
    quickCategoriesTitle: 'सामग्री श्रेणियाँ',

    vicharTitle: 'विचार एवं संदेश',
    vicharSubtitle: 'नवीनतम विचार और संदेश पढ़ें',
    allFilter: 'सभी',

    videoTitle: 'वीडियो दर्शन',
    videoSubtitle: 'प्रेरक एवं ज्ञानवर्धक वीडियो व्याख्यान',

    samagriTitle: 'सामग्री पुस्तकालय',
    samagriSubtitle: 'ऑडियो, फोटो, दस्तावेज और सूचनाएँ',

    khojTitle: 'खोज',
    khojSubtitle: 'विचार, वीडियो, ऑडियो और दस्तावेज खोजें',

    missionHeading: 'मिशन',
    missionSubheading: 'अहिंसा शिक्षा मिशन का उद्देश्य और मूल्यबोध',
    ourObjectiveTitle: 'हमारा उद्देश्य',
    ourObjectiveText: 'अहिंसा शिक्षा मिशन का उद्देश्य अहिंसा, सत्य, शिक्षा और मानवता से जुड़े सकारात्मक विचारों को लोगों तक पहुँचाना है। समाज में शांति, सहिष्णुता, करुणा और नैतिक शिक्षा के मूल्यों को प्रोत्साहित करना।',
    ourPhilosophyTitle: 'हमारे विचार',
    ourPhilosophyText: 'अहिंसा केवल शारीरिक हिंसा का अभाव नहीं है, बल्कि मन, वचन और कर्म में करुणा और समरसता की उपस्थिति है। शिक्षा केवल अक्षर ज्ञान नहीं, बल्कि आत्म-बोध और सामाजिक दायित्व का मार्ग है।',
    ourEffortTitle: 'हमारा प्रयास',
    ourEffortText: 'दैनिक जीवन में सकारात्मक विचारों, प्रेरक संदेशों, नैतिक पाठों और विचार-विमर्श के माध्यम से समाज में सद्भाव का वातावरण निर्मित करना।',
    corePillarsTitle: 'मूल सिद्धांत',

    founderHeading: 'संस्थापक',
    founderSubheading: 'संस्थापक का परिचय एवं दिशा-निर्देश',
    founderName: 'अमर लाल चौधरी',
    founderRole: 'संस्थापक • अहिंसा शिक्षा मिशन',
    founderBioTitle: 'परिचय',
    founderBioPlaceholder: 'संस्थापक के बारे में संक्षिप्त परिचय यहाँ प्रदर्शित होगा।',
    founderMessageTitle: 'संस्थापक का संदेश',
    founderMessagePlaceholder: '“अहिंसा और सत्य ही वह आधारशिला हैं जिस पर एक न्यायपूर्ण और दयालु समाज की रचना हो सकती है। हमारा संकल्प है कि शिक्षा हर हृदय में करुणा का दीप प्रज्वलित करे।”',
    placeholderNotice: 'यह जानकारी आधिकारिक विवरण उपलब्ध होने पर अद्यतन की जाएगी।',

    contactHeading: 'संपर्क',
    contactSubheading: 'मिशन से संपर्क करें',
    phoneLabel: 'फ़ोन',
    emailLabel: 'ईमेल',
    addressLabel: 'पता',
    callButton: 'कॉल करें',
    emailButton: 'ईमेल भेजें',
    mockContactNotice: 'संपर्क विवरण जल्द उपलब्ध कराया जाएगा।',

    linksHeading: 'महत्वपूर्ण लिंक',
    linksSubheading: 'आधिकारिक और उपयोगी संसाधन',
    officialWebsite: 'आधिकारिक वेबसाइट',
    officialWebsiteDesc: 'मिशन की मुख्य वेबसाइट और घोषणाएँ',
    youtubeChannel: 'यूट्यूब चैनल',
    youtubeChannelDesc: 'सभी वीडियो व्याख्यान एवं प्रसारण',
    socialCommunity: 'सोशल मीडिया लिंक',
    socialCommunityDesc: 'सकारात्मक विचारों से जुड़े रहें',
    studyResources: 'अन्य महत्वपूर्ण स्रोत',
    studyResourcesDesc: 'अहिंसा और नैतिक शिक्षा पर अध्ययन सामग्री',
    openLink: 'खोलें',

    emptyHomeTitle: 'अभी कोई प्रकाशित सामग्री उपलब्ध नहीं है।',
    emptyHomeDesc: 'नई सामग्री जल्द यहाँ दिखाई देगी।',
    emptyHomeAction: 'सामग्री श्रेणियाँ देखें',
    emptyVicharTitle: 'अभी कोई विचार उपलब्ध नहीं है',
    emptyVicharDesc: 'नए विचार और संदेश जल्द यहाँ प्रकाशित किए जाएँगे।',
    emptyVideoTitle: 'अभी कोई वीडियो उपलब्ध नहीं है',
    emptyVideoDesc: 'नए वीडियो व्याख्यान जल्द यहाँ प्रकाशित किए जाएँगे।',
    emptyAudioTitle: 'अभी कोई ऑडियो उपलब्ध नहीं है',
    emptyAudioDesc: 'नए ऑडियो संदेश यहाँ दिखाई देंगे।',
    emptyPhotoTitle: 'अभी कोई फोटो उपलब्ध नहीं है',
    emptyPhotoDesc: 'मिशन की गतिविधियों की नई तस्वीरें यहाँ दिखाई देंगी।',
    emptyDocTitle: 'अभी कोई दस्तावेज उपलब्ध नहीं है',
    emptyDocDesc: 'नए दस्तावेज और अध्ययन सामग्री यहाँ दिखाई देंगे।',
    emptyNoticeTitle: 'अभी कोई सूचना उपलब्ध नहीं है',
    emptyNoticeDesc: 'मिशन की नई सूचनाएँ और अपडेट यहाँ दिखाई देंगे।',
    emptySearchTitle: 'कोई परिणाम नहीं मिला',
    emptySearchDesc: 'किसी दूसरे शब्द से खोजने का प्रयास करें।',
    emptyRecentTitle: 'अभी कोई हाल की सामग्री उपलब्ध नहीं है।',
    emptyLinksTitle: 'अभी कोई महत्वपूर्ण लिंक नहीं है',
    emptyLinksDesc: 'महत्वपूर्ण लिंक जल्द जोड़े जाएँगे।',
    emptyFounderTitle: 'संस्थापक परिचय की जानकारी जल्द उपलब्ध होगी।',
    emptyFounderDesc: 'यह जानकारी अभी उपलब्ध नहीं है।',
    emptyContactTitle: 'संपर्क विवरण जल्द उपलब्ध होगा।',
    emptyContactDesc: 'यह जानकारी अभी उपलब्ध नहीं है।',
  },

  en: {
    navHome: 'Home',
    navVichar: 'Thoughts',
    navVideo: 'Videos',
    navSamagri: 'Content',
    navKhoj: 'Search',

    brandTitle: 'Ahimsa Shiksha Mission',
    brandTagline: 'Truth • Non-Violence • Education • Humanity',
    settingsHeaderTitle: 'Settings',
    settingsSubtitle: 'App preferences and mission information',

    back: 'Back',
    viewAll: 'View All',
    viewMore: 'View More',
    readMore: 'Read More',
    listen: 'Listen',
    pause: 'Pause',
    download: 'Download',
    share: 'Share',
    copied: 'Link copied to clipboard',
    searchPlaceholder: 'Search... (e.g. non-violence, truth, education)',
    totalCount: 'Total',
    newestFirst: 'Newest First',
    seeAllContent: 'View All Content',

    appearanceSection: 'Appearance',
    themeLabel: 'Theme',
    themeLight: '☀️ Light',
    themeDark: '🌙 Dark',

    languageSection: 'Language',
    languageLabel: 'Language',
    languageNote: 'Published content remains in its original language.',

    infoSection: 'Information',
    missionTitle: 'Mission',
    missionDesc: 'Objectives and philosophy',
    founderTitle: 'About / Founder',
    founderDesc: 'Founder introduction and guidance',
    contactTitle: 'Contact',
    contactDesc: 'Contact methods and details',
    linksTitle: 'Important Links',
    linksDesc: 'Useful links and resources',

    adminSection: 'Administration',
    adminTitle: 'Admin Panel',
    adminDesc: 'Manage the mission website',

    welcomeTitle: 'Welcome to Ahimsa Shiksha Mission',
    welcomeSubtitle: 'Spreading values of truth, non-violence and peace',
    quoteOfDayTitle: 'Thought of the Day',
    latestVideosTitle: 'Latest Videos',
    audioMessagesTitle: 'Audio Messages',
    quickCategoriesTitle: 'Content Categories',

    vicharTitle: 'Thoughts & Messages',
    vicharSubtitle: 'Read inspiring thoughts and messages',
    allFilter: 'All',

    videoTitle: 'Videos',
    videoSubtitle: 'Inspiring and educational video lectures',

    samagriTitle: 'Content Library',
    samagriSubtitle: 'Audio, photos, documents and notices',

    khojTitle: 'Search',
    khojSubtitle: 'Search thoughts, videos, audio and documents',

    missionHeading: 'Mission',
    missionSubheading: 'Objectives and core values of Ahimsa Shiksha Mission',
    ourObjectiveTitle: 'Our Objective',
    ourObjectiveText: 'The objective of Ahimsa Shiksha Mission is to disseminate positive thoughts related to non-violence, truth, education, and humanity. To promote peace, tolerance, compassion, and moral education in society.',
    ourPhilosophyTitle: 'Our Philosophy',
    ourPhilosophyText: 'Non-violence is not merely the absence of physical violence, but the presence of compassion and harmony in thought, speech, and action. Education is the pathway to self-awareness and social responsibility.',
    ourEffortTitle: 'Our Endeavor',
    ourEffortText: 'Creating an atmosphere of peace and harmony in society through daily positive thoughts, inspiring messages, moral lessons, and constructive dialogue.',
    corePillarsTitle: 'Core Principles',

    founderHeading: 'Founder',
    founderSubheading: 'Founder introduction and guidance',
    founderName: 'Amar Lal Choudhari',
    founderRole: 'Founder • Ahimsa Shiksha Mission',
    founderBioTitle: 'Introduction',
    founderBioPlaceholder: 'A brief introduction of the founder will appear here.',
    founderMessageTitle: "Founder's Message",
    founderMessagePlaceholder: '“Non-violence and truth are the foundation upon which a just and compassionate society can be built. Our resolve is that education lights the lamp of compassion in every heart.”',
    placeholderNotice: 'This information will be updated when official details are provided.',

    contactHeading: 'Contact',
    contactSubheading: 'Get in touch with the mission',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
    callButton: 'Call',
    emailButton: 'Email',
    mockContactNotice: 'Official contact details will be made available soon.',

    linksHeading: 'Important Links',
    linksSubheading: 'Official and useful resources',
    officialWebsite: 'Official Website',
    officialWebsiteDesc: 'Main website and official announcements',
    youtubeChannel: 'YouTube Channel',
    youtubeChannelDesc: 'All video lectures and broadcasts',
    socialCommunity: 'Social Link',
    socialCommunityDesc: 'Stay connected with daily thoughts',
    studyResources: 'Other Important Resources',
    studyResourcesDesc: 'Study material on non-violence and moral education',
    openLink: 'Open',

    emptyHomeTitle: 'No published content available yet.',
    emptyHomeDesc: 'New content will appear here soon.',
    emptyHomeAction: 'View Content Categories',
    emptyVicharTitle: 'No thoughts available yet',
    emptyVicharDesc: 'New thoughts and messages will be published here soon.',
    emptyVideoTitle: 'No videos available yet',
    emptyVideoDesc: 'New video lectures will be published here soon.',
    emptyAudioTitle: 'No audio available yet',
    emptyAudioDesc: 'New audio messages will appear here.',
    emptyPhotoTitle: 'No photos available yet',
    emptyPhotoDesc: 'Photos of mission activities will appear here.',
    emptyDocTitle: 'No documents available yet',
    emptyDocDesc: 'New documents and study materials will appear here.',
    emptyNoticeTitle: 'No notices available yet',
    emptyNoticeDesc: 'New mission announcements will appear here.',
    emptySearchTitle: 'No results found',
    emptySearchDesc: 'Try searching with a different keyword.',
    emptyRecentTitle: 'No recent content available yet.',
    emptyLinksTitle: 'No important links available yet',
    emptyLinksDesc: 'Important links will be added soon.',
    emptyFounderTitle: 'Founder information will be available soon.',
    emptyFounderDesc: 'This information is not yet available.',
    emptyContactTitle: 'Contact details will be available soon.',
    emptyContactDesc: 'This information is not yet available.',
  },
};

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'asm_language';
const THEME_STORAGE_KEY = 'asm_theme';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State (DEFAULT = 'hi')
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') {
        return stored;
      }
    }
    return 'hi';
  });

  // 2. Theme State (DEFAULT = 'light')
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return 'light';
  });

  // Sync theme changes to HTML document element for global styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [theme]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        setLanguage,
        setTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
