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
  publishedAt?: string;
  language?: ContentLanguage;
  likesCount?: number;
}

export interface AdminNotificationItem {
  id: string;
  type: 'like' | string;
  event: string;
  contentType: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice' | string;
  contentId: string;
  contentTitle: string;
  totalLikes: number;
  createdAt: string;
  read: boolean;
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
  youtubeVideoId?: string;
  thumbnailUrl: string;
  thumbnailFileId?: string;
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
  audioFileId?: string;
  topics?: string[];
}

export interface PhotoItem extends BaseContentItem {
  type: 'photo';
  typeLabel?: string;
  caption: string;
  description: string;
  imageUrl: string;
  imageFileId?: string;
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
  fileId?: string;
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
  return {
    version: '2.0.0',
    vichar: [],
    videos: [],
    audio: [],
    photos: [],
    documents: [],
    notices: [],
    links: [
      {
        id: 'link-facebook',
        title: 'Facebook',
        url: 'https://www.facebook.com/share/1MRf7TAZsH/',
        description: '',
        status: 'published',
        order: 1,
        category: 'facebook',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    mission: { title: "", subtitle: "", updatedAt: "" },
    founder: {
      name: "अमर लाल चौधरी",
      role: "संस्थापक • अहिंसा शिक्षा मिशन",
      bio: "संस्थापक के बारे में संक्षिप्त परिचय यहाँ प्रदर्शित होगा।",
      message: "“अहिंसा और सत्य ही वह आधारशिला हैं जिस पर एक न्यायपूर्ण और दयालु समाज की रचना हो सकती है। हमारा संकल्प है कि शिक्षा हर हृदय में करुणा का दीप प्रज्वलित करे।”",
      updatedAt: new Date().toISOString(),
    },
    contact: {
      email: "amarsiwan1975@gmail.com",
      phone: "",
      address: "नरहट, सिवान, बिहार",
      updatedAt: new Date().toISOString(),
    }
  };
}

// Load initial data from localStorage cache if available
export function loadStoreFromStorage(): AppStoreData {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const initial = getInitialSeedData();
          return {
            version: parsed.version || initial.version,
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
        }
      }
    } catch (err) {
      console.warn('Error loading CMS data from localStorage:', err);
    }
  }
  return getInitialSeedData();
}

// Save data to LocalStorage cache (optional secondary cache)
export function saveStoreToStorage(data: AppStoreData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving CMS data to localStorage:', err);
    }
  }
}
