import {
  peacefulSunThumbnail,
  peacefulAshramPhoto,
  satyagrahaThumbnail,
  workshopPhoto,
} from '../data/homeFeed';
import {
  prayerGatheringPhoto,
  studentDialoguePhoto,
  awarenessPhoto,
  libraryHallPhoto,
  treePlantingPhoto,
  mockMessages,
  mockVideos,
  mockAudios,
  mockPhotos,
  mockDocuments,
  mockNotices,
} from '../data/mockContent';

export type ContentStatus = 'published' | 'draft';
export type ContentLanguage = 'hi' | 'en';

export interface BaseContentItem {
  id: string;
  title: string;
  date: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  language?: ContentLanguage;
}

export interface VicharItem extends BaseContentItem {
  type: 'vichar';
  typeLabel?: string;
  author: string;
  topic?: string;
  source?: string;
  leadParagraph: string;
  paragraphs: string[];
  keyTakeaway?: string;
  imageUrl?: string;
  titleHindi?: string;
  textHindi?: string;
}

export interface VideoItem extends BaseContentItem {
  type: 'video';
  typeLabel?: string;
  speaker: string;
  duration: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  topics?: string[];
}

export interface AudioItem extends BaseContentItem {
  type: 'audio';
  typeLabel?: string;
  speaker: string;
  duration: string;
  currentTime?: string;
  description: string;
  aboutText: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  audioUrl?: string;
  topics?: string[];
}

export interface PhotoItem extends BaseContentItem {
  type: 'photo';
  typeLabel?: string;
  caption: string;
  description: string;
  imageUrl: string;
  location?: string;
}

export interface DocumentItem extends BaseContentItem {
  type: 'document';
  typeLabel?: string;
  description: string;
  fileType: string;
  fileSize: string;
  pages: string;
  summary: string;
  chapters: string[];
  fileName?: string;
  pdfUrl?: string;
  category?: string;
}

export interface NoticeItem extends BaseContentItem {
  type: 'notice';
  typeLabel?: string;
  content: string;
  message?: string;
  organizer?: string;
  location?: string;
  variant: 'blue' | 'gold' | 'green';
  details: {
    eventDate: string;
    time: string;
    venue: string;
    subject: string;
  };
  guidelines: string[];
  contactInfo: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  status: ContentStatus;
  order: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissionData {
  title: string;
  subtitle: string;
  objectiveTitle?: string;
  objectiveText?: string;
  objective?: string;
  philosophyTitle?: string;
  philosophyText?: string;
  philosophy?: string;
  effortTitle?: string;
  effortText?: string;
  effort?: string;
  additionalInfo?: string;
  corePillars?: string[];
  pillars?: Array<{
    id: string;
    title: string;
    subtitle: string;
    desc: string;
    color?: string;
    bg?: string;
  }>;
  updatedAt: string;
}

export interface FounderData {
  name: string;
  role: string;
  title?: string;
  photoUrl?: string;
  quote?: string;
  bio?: string;
  message?: string;
  bioTitle?: string;
  bioText?: string;
  messageTitle?: string;
  messageText?: string;
  updatedAt: string;
}

export interface ContactData {
  phone: string;
  email: string;
  address: string;
  officeHours?: string;
  guidance?: string;
  note?: string;
  mapEmbedUrl?: string;
  additionalInfo?: string;
  updatedAt: string;
}

export interface AppStoreData {
  version?: string;
  vichar: VicharItem[];
  videos: VideoItem[];
  audio: AudioItem[];
  photos: PhotoItem[];
  documents: DocumentItem[];
  notices: NoticeItem[];
  links: LinkItem[];
  mission: MissionData;
  founder: FounderData;
  contact: ContactData;
}

export const CMS_STORAGE_KEY = 'asm_cms_data_v1';

// Format current date in Hindi friendly format
export function getFormattedCurrentDate(): string {
  const monthsHindi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const now = new Date();
  const day = now.getDate();
  const month = monthsHindi[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

export function generateUniqueId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

// Initial seed data generator
export function getInitialSeedData(): AppStoreData {
  const nowIso = new Date().toISOString();

  // 1. Vichar
  const vichar: VicharItem[] = Object.values(mockMessages).map((m, idx) => ({
    id: m.id,
    type: 'vichar',
    typeLabel: m.typeLabel || '📝 संदेश',
    title: m.title,
    date: m.date,
    author: m.author,
    topic: m.topic || 'अहिंसा',
    source: m.source || 'अहिंसा विचार माला',
    leadParagraph: m.leadParagraph,
    paragraphs: m.paragraphs || [],
    keyTakeaway: m.keyTakeaway,
    imageUrl: m.imageUrl || peacefulSunThumbnail,
    status: 'published',
    language: 'hi',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 2. Videos
  const youtubeSamples: Record<string, string> = {
    '1': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    '2': 'https://www.youtube.com/watch?v=VIDEO_ID_2',
    '3': 'https://www.youtube.com/watch?v=VIDEO_ID_3',
    '4': 'https://www.youtube.com/watch?v=VIDEO_ID_4',
    '5': 'https://www.youtube.com/watch?v=VIDEO_ID_5',
    '6': 'https://www.youtube.com/watch?v=VIDEO_ID_6',
  };

  const videos: VideoItem[] = Object.values(mockVideos).map((v, idx) => ({
    id: v.id,
    type: 'video',
    typeLabel: v.typeLabel || '🎥 वीडियो',
    title: v.title,
    date: v.date,
    speaker: v.speaker,
    duration: v.duration,
    youtubeUrl: youtubeSamples[v.id] || `https://www.youtube.com/watch?v=sample_${v.id}`,
    thumbnailUrl: v.thumbnailUrl || peacefulSunThumbnail,
    description: v.description,
    topics: v.topics || [],
    status: 'published',
    language: 'hi',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 3. Audio
  const audio: AudioItem[] = Object.values(mockAudios).map((a, idx) => ({
    id: a.id,
    type: 'audio',
    typeLabel: a.typeLabel || '🎧 ऑडियो संदेश',
    title: a.title,
    date: a.date,
    speaker: a.speaker,
    duration: a.duration,
    currentTime: a.currentTime || '००:००',
    description: a.description,
    aboutText: a.aboutText,
    fileName: `pravachan_track_${a.id}.mp3`,
    fileSize: '३.२ MB',
    fileType: 'audio/mpeg',
    status: 'published',
    language: 'hi',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 4. Photos
  const photos: PhotoItem[] = Object.values(mockPhotos).map((p, idx) => ({
    id: p.id,
    type: 'photo',
    typeLabel: p.typeLabel || '🖼️ फोटो',
    title: p.title,
    date: p.date,
    caption: p.caption,
    description: p.description,
    imageUrl: p.imageUrl || peacefulAshramPhoto,
    location: p.location || 'गांधी अध्ययन केंद्र परिसर',
    status: 'published',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 5. Documents
  const documents: DocumentItem[] = Object.values(mockDocuments).map((d, idx) => ({
    id: d.id,
    type: 'document',
    typeLabel: d.typeLabel || '📄 दस्तावेज',
    title: d.title,
    date: d.date,
    description: d.description,
    fileType: d.fileType || 'PDF',
    fileSize: d.fileSize || '२.४ MB',
    pages: d.pages || '१६',
    summary: d.summary,
    chapters: d.chapters || [],
    fileName: `ahimsa_doc_${d.id}.pdf`,
    status: 'published',
    language: 'hi',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 6. Notices
  const notices: NoticeItem[] = Object.values(mockNotices).map((n, idx) => ({
    id: n.id,
    type: 'notice',
    typeLabel: n.typeLabel || '📢 सूचना',
    title: n.title,
    date: n.date,
    content: n.content,
    variant: n.variant || 'blue',
    details: n.details || {
      eventDate: '१५ सितंबर २०२६',
      time: 'प्रातः १०:०० बजे से',
      venue: 'मुख्य सभागार',
      subject: 'अहिंसा शिक्षा विचार',
    },
    guidelines: n.guidelines || [],
    contactInfo: n.contactInfo || 'मिशन कार्यालय से संपर्क करें।',
    status: 'published',
    createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
  }));

  // 7. Links
  const links: LinkItem[] = [
    {
      id: 'website',
      title: 'आधिकारिक वेबसाइट',
      url: 'https://example.org',
      description: 'मुख्य वेबसाइट और आधिकारिक घोषणाएँ',
      status: 'published',
      order: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'youtube',
      title: 'यूट्यूब चैनल',
      url: 'https://youtube.com',
      description: 'सभी वीडियो व्याख्यान और प्रसारण',
      status: 'published',
      order: 2,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'community',
      title: 'सोशल कम्युनिटी मंच',
      url: 'https://example.org/community',
      description: 'दैनिक विचारों व संवाद से जुड़ें',
      status: 'published',
      order: 3,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'resources',
      title: 'अध्ययन स्रोत व साहित्य',
      url: 'https://example.org/resources',
      description: 'अहिंसा और मूल्य शिक्षा पर संदर्भ सामग्री',
      status: 'published',
      order: 4,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  // 8. Mission
  const mission: MissionData = {
    title: 'मिशन का उद्देश्य',
    subtitle: 'सत्य, अहिंसा और नैतिक शिक्षा के माध्यम से समाज में शांति और सद्भाव का विस्तार करना।',
    objectiveTitle: 'हमारा ध्येय',
    objectiveText: 'अहिंसा शिक्षा मिशन का मुख्य उद्देश्य समाज के प्रत्येक वर्ग में सत्य, करुणा और परस्पर बंधुत्व के मूल्यों का प्रसार करना है। हम विद्यार्थियों और युवाओं को चारित्रिक दृढ़ता और मानवीय संवेदनाओं से जोड़ने के लिए निरंतर प्रयासरत हैं।',
    philosophyTitle: 'विचार दर्शन',
    philosophyText: 'अहिंसा केवल अस्त्र त्यागने का नाम नहीं है, यह मन, वचन और कर्म में किसी भी प्राणी के प्रति दुर्भावना न रखने का एक उच्च आध्यात्मिक व व्यावहारिक संकल्प है।',
    effortTitle: 'हमारा प्रयास',
    effortText: 'कार्यशालाओं, विचार-गोष्ठियों, निःशुल्क अध्ययन सामग्री और संवाद सत्रों के द्वारा नैतिक मूल्यों का बीजारोपण करना।',
    additionalInfo: 'मिशन के सभी कार्यक्रम और साहित्य जन-कल्याण हेतु निःशुल्क उपलब्ध कराए जाते हैं।',
    pillars: [
      {
        id: 'p1',
        title: 'सत्य',
        subtitle: 'Truth',
        desc: 'विचार, वाणी और आचरण में सच्चाई की दृढ़ता',
        color: 'text-[#D97706]',
        bg: 'bg-[#FEF8EC]',
      },
      {
        id: 'p2',
        title: 'अहिंसा',
        subtitle: 'Non-Violence',
        desc: 'प्राणी मात्र के प्रति करुणा और द्वेषरहित दृष्टि',
        color: 'text-[#2E7D32]',
        bg: 'bg-[#F0FDF4]',
      },
      {
        id: 'p3',
        title: 'शिक्षा',
        subtitle: 'Education',
        desc: 'नैतिक मूल्य, सद्विचार और आत्मनिर्भरता का विकास',
        color: 'text-[#16325C]',
        bg: 'bg-[#EEF3FA]',
      },
      {
        id: 'p4',
        title: 'मानवता',
        subtitle: 'Humanity',
        desc: 'सद्भाव, सेवा और समतामूलक समाज की भावना',
        color: 'text-[#254B85]',
        bg: 'bg-[#EEF3FA]',
      },
    ],
    updatedAt: nowIso,
  };

  // 9. Founder
  const founder: FounderData = {
    name: 'संस्थापक (Placeholder)',
    role: 'संस्थापक • अहिंसा शिक्षा मिशन',
    photoUrl: '',
    bioTitle: 'जीवन परिचय',
    bioText: 'संस्थापक का वास्तविक परिचय और संदेश बाद में जोड़ा जाएगा। अहिंसा शिक्षा मिशन की स्थापना सत्य, शांति, सद्भाव और मानवीय मूल्यों के प्रचार-प्रसार के पावन संकल्प के साथ की गई है।',
    messageTitle: 'संस्थापक का पावन संदेश',
    messageText: '“अहिंसा और सत्य ही वह ध्रुव तारे हैं, जो मानव सभ्यता को अंधकार से प्रकाश की ओर ले जाने में समर्थ हैं। जब हम अपने जीवन को करुणा और सेवा से भरते हैं, तो समाज स्वयं सुंदर बन जाता है।”',
    updatedAt: nowIso,
  };

  // 10. Contact
  const contact: ContactData = {
    phone: '+91 XXXXX XXXXX',
    email: 'contact@example.com',
    address: 'अहिंसा भवन, शिक्षा मार्ग, नई दिल्ली - 110001',
    officeHours: 'सोमवार से शनिवार: प्रातः ९:३० बजे से सायं ५:३० बजे तक',
    additionalInfo: 'यह संपर्क विवरण स्थानीय प्रोटोटाइप का भाग है।',
    updatedAt: nowIso,
  };

  return {
    vichar,
    videos,
    audio,
    photos,
    documents,
    notices,
    links,
    mission,
    founder,
    contact,
  };
}

// Load data from LocalStorage or seed defaults
export function loadStoreFromStorage(): AppStoreData {
  if (typeof window === 'undefined') {
    return getInitialSeedData();
  }

  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedData();
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure all keys exist in case of partial structure
    const initial = getInitialSeedData();
    return {
      vichar: Array.isArray(parsed.vichar) ? parsed.vichar : initial.vichar,
      videos: Array.isArray(parsed.videos) ? parsed.videos : initial.videos,
      audio: Array.isArray(parsed.audio) ? parsed.audio : initial.audio,
      photos: Array.isArray(parsed.photos) ? parsed.photos : initial.photos,
      documents: Array.isArray(parsed.documents) ? parsed.documents : initial.documents,
      notices: Array.isArray(parsed.notices) ? parsed.notices : initial.notices,
      links: Array.isArray(parsed.links) ? parsed.links : initial.links,
      mission: parsed.mission ? { ...initial.mission, ...parsed.mission } : initial.mission,
      founder: parsed.founder ? { ...initial.founder, ...parsed.founder } : initial.founder,
      contact: parsed.contact ? { ...initial.contact, ...parsed.contact } : initial.contact,
    };
  } catch (err) {
    console.error('Error loading CMS data from localStorage:', err);
    return getInitialSeedData();
  }
}

// Save data to LocalStorage
export function saveStoreToStorage(data: AppStoreData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving CMS data to localStorage:', err);
    }
  }
}
