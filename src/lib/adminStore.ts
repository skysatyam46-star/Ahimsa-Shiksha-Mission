export const CMS_STORAGE_KEY = 'asm_cms_data_v2';

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

// Initial seed data generator (Starts empty in production as per Phase 5D)
export function getInitialSeedData(): AppStoreData {
  const nowIso = new Date().toISOString();

  return {
    version: '2.0.0',
    vichar: [],
    videos: [],
    audio: [],
    photos: [],
    documents: [],
    notices: [],
    links: [],
    mission: {
      title: 'अहिंसा शिक्षा मिशन',
      subtitle: '',
      objectiveTitle: 'हमारा उद्देश्य',
      objectiveText: '',
      objective: '',
      philosophyTitle: 'हमारा दर्शन',
      philosophyText: '',
      philosophy: '',
      effortTitle: 'हमारा प्रयास',
      effortText: '',
      effort: '',
      additionalInfo: '',
      corePillars: [],
      pillars: [],
      updatedAt: nowIso,
    },
    founder: {
      name: '',
      role: '',
      title: '',
      photoUrl: '',
      quote: '',
      bio: '',
      message: '',
      bioTitle: 'जीवन परिचय',
      bioText: '',
      messageTitle: 'संस्थापक का संदेश',
      messageText: '',
      updatedAt: nowIso,
    },
    contact: {
      phone: '',
      email: '',
      address: '',
      officeHours: '',
      guidance: '',
      note: '',
      mapEmbedUrl: '',
      additionalInfo: '',
      updatedAt: nowIso,
    },
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
    const initial = getInitialSeedData();
    return {
      version: parsed.version || '2.0.0',
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
