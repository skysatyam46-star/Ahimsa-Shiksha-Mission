import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  AppStoreData,
  VicharItem,
  VideoItem,
  AudioItem,
  PhotoItem,
  DocumentItem,
  NoticeItem,
  LinkItem,
  MissionData,
  FounderData,
  ContactData,
  getInitialSeedData,
  loadStoreFromStorage,
  saveStoreToStorage,
  generateUniqueId,
  getFormattedCurrentDate,
} from '../lib/adminStore';

export interface RecentAdminItem {
  id: string;
  type: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice';
  typeLabel: string;
  title: string;
  date: string;
  status: 'published' | 'draft';
  updatedAt: string;
  adminEditPath: string;
  publicViewPath: string;
}

export interface PublicSearchResult {
  id: string;
  type: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice';
  typeLabel: string;
  title: string;
  excerpt: string;
  date: string;
  route: string;
}

interface DataContextType {
  data: AppStoreData;
  loading: boolean;
  counts: {
    vichar: number;
    videos: number;
    audio: number;
    photos: number;
    documents: number;
    notices: number;
    links: number;
    total: number;
    published: number;
    draft: number;
  };
  // Vichar CRUD
  addVichar: (item: Partial<VicharItem>) => Promise<VicharItem>;
  updateVichar: (id: string, item: Partial<VicharItem>) => Promise<void>;
  deleteVichar: (id: string) => Promise<void>;
  getVicharById: (id: string) => VicharItem | undefined;

  // Video CRUD
  addVideo: (item: Partial<VideoItem>) => Promise<VideoItem>;
  updateVideo: (id: string, item: Partial<VideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getVideoById: (id: string) => VideoItem | undefined;

  // Audio CRUD
  addAudio: (item: Partial<AudioItem>) => Promise<AudioItem>;
  updateAudio: (id: string, item: Partial<AudioItem>) => Promise<void>;
  deleteAudio: (id: string) => Promise<void>;
  getAudioById: (id: string) => AudioItem | undefined;

  // Photo CRUD
  addPhoto: (item: Partial<PhotoItem>) => Promise<PhotoItem>;
  updatePhoto: (id: string, item: Partial<PhotoItem>) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  getPhotoById: (id: string) => PhotoItem | undefined;

  // Document CRUD
  addDocument: (item: Partial<DocumentItem>) => Promise<DocumentItem>;
  updateDocument: (id: string, item: Partial<DocumentItem>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => DocumentItem | undefined;

  // Notice CRUD
  addNotice: (item: Partial<NoticeItem>) => Promise<NoticeItem>;
  updateNotice: (id: string, item: Partial<NoticeItem>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  getNoticeById: (id: string) => NoticeItem | undefined;

  // Link CRUD
  addLink: (item: Partial<LinkItem>) => Promise<LinkItem>;
  updateLink: (id: string, item: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (orderedIds: string[]) => Promise<void>;

  // Website Settings / CMS
  updateMission: (mission: Partial<MissionData>) => Promise<void>;
  updateFounder: (founder: Partial<FounderData>) => Promise<void>;
  updateContact: (contact: Partial<ContactData>) => Promise<void>;
  resetDemoData: () => void;
  resetToSeedData: () => void;
  restoreData: (newData: AppStoreData) => void;

  // Public Query Helpers
  getPublishedVichar: () => VicharItem[];
  getPublishedVideos: () => VideoItem[];
  getPublishedAudio: () => AudioItem[];
  getPublishedPhotos: () => PhotoItem[];
  getPublishedDocuments: () => DocumentItem[];
  getPublishedNotices: () => NoticeItem[];
  getPublishedLinks: () => LinkItem[];
  searchPublishedContent: (query: string) => PublicSearchResult[];
  getRecentAdminContent: (limit?: number) => RecentAdminItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to construct authorization headers for admin requests
export const getAdminAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ahimsa_admin_token');
    if (token) {
      headers['x-admin-token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Helper for API saving with resilient persistence and credentials
const saveContentItemToApi = async (item: any) => {
  try {
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || 'डेटाबेस (Firestore) में सामग्री सहेजने में विफल।';
      console.error('[DataContext] Error saving content to Firestore:', msg);
      throw new Error(msg);
    }
    return await res.json();
  } catch (err: any) {
    console.error('[DataContext] Exception saving content to Firestore:', err);
    throw err;
  }
};

const deleteContentItemFromApi = async (id: string) => {
  try {
    const res = await fetch(`/api/admin/content/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || 'डेटाबेस (Firestore) से सामग्री हटाने में विफल।';
      console.error('[DataContext] Error deleting content from Firestore:', msg);
      throw new Error(msg);
    }
    return await res.json();
  } catch (err: any) {
    console.error('[DataContext] Exception deleting content from Firestore:', err);
    throw err;
  }
};

const saveLinkToApi = async (item: any) => {
  try {
    const res = await fetch('/api/admin/links', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || 'लिंक सहेजने में विफल।';
      console.error('[DataContext] Warning saving link:', msg);
      throw new Error(msg);
    }
    return await res.json();
  } catch (err: any) {
    console.error('[DataContext] Error saving link to Firestore:', err);
    throw err;
  }
};

const deleteLinkFromApi = async (id: string) => {
  try {
    const res = await fetch(`/api/admin/links/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || 'लिंक हटाने में विफल।';
      console.error('[DataContext] Warning deleting link:', msg);
      throw new Error(msg);
    }
    return await res.json();
  } catch (err: any) {
    console.error('[DataContext] Error deleting link from Firestore:', err);
    throw err;
  }
};

const saveSettingsDocToApi = async (docId: string, payload: any) => {
  try {
    const res = await fetch(`/api/admin/settings/${docId}`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || `${docId} सेटिंग सहेजने में विफल।`;
      console.error(`[DataContext] Warning saving ${docId}:`, msg);
      throw new Error(msg);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`[DataContext] Error saving ${docId} to Firestore:`, err);
    throw err;
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AppStoreData>(() => loadStoreFromStorage());

  // Automatically keep localStorage cache synchronized with latest state
  useEffect(() => {
    saveStoreToStorage(data);
  }, [data]);

  // Load store from Firestore API on mount and whenever admin login status changes
  useEffect(() => {
    let isMounted = true;
    
    const handleRefetch = () => {
      fetchFirestoreData();
    };
    window.addEventListener('refetch-data', handleRefetch);
    setLoading(true);

    const fetchFirestoreData = async () => {
      try {
        if (isAdmin) {
          console.info('[DataContext] Fetching Admin CMS data (drafts + published) from Firestore...');
          const res = await fetch('/api/admin/get-data', { 
            headers: getAdminAuthHeaders(),
            credentials: 'include' 
          });
          if (res.ok) {
            const result = await res.json();
            if (result && result.success && result.data && isMounted) {
              const initial = getInitialSeedData();
              const merged: AppStoreData = {
                version: result.data.version || '2.0.0',
                vichar: Array.isArray(result.data.vichar) ? result.data.vichar : [],
                videos: Array.isArray(result.data.videos) ? result.data.videos : [],
                audio: Array.isArray(result.data.audio) ? result.data.audio : [],
                photos: Array.isArray(result.data.photos) ? result.data.photos : [],
                documents: Array.isArray(result.data.documents) ? result.data.documents : [],
                notices: Array.isArray(result.data.notices) ? result.data.notices : [],
                links: Array.isArray(result.data.links) ? result.data.links : [],
                mission: result.data.mission ? { ...initial.mission, ...result.data.mission } : initial.mission,
                founder: result.data.founder ? { ...initial.founder, ...result.data.founder } : initial.founder,
                contact: result.data.contact ? { ...initial.contact, ...result.data.contact } : initial.contact,
              };
              setData(merged);
              saveStoreToStorage(merged);
              setLoading(false);
              return;
            }
          }
        } else {
          console.info('[DataContext] Fetching Public CMS data (published only) from Firestore...');
          const res = await fetch('/api/get-public-data');
          if (res.ok) {
            const publicStore = await res.json();
            if (publicStore && isMounted) {
              const initial = getInitialSeedData();
              const merged: AppStoreData = {
                version: publicStore.version || '2.0.0',
                vichar: Array.isArray(publicStore.vichar) ? publicStore.vichar : [],
                videos: Array.isArray(publicStore.videos) ? publicStore.videos : [],
                audio: Array.isArray(publicStore.audio) ? publicStore.audio : [],
                photos: Array.isArray(publicStore.photos) ? publicStore.photos : [],
                documents: Array.isArray(publicStore.documents) ? publicStore.documents : [],
                notices: Array.isArray(publicStore.notices) ? publicStore.notices : [],
                links: Array.isArray(publicStore.links) ? publicStore.links : [],
                mission: publicStore.mission ? { ...initial.mission, ...publicStore.mission } : initial.mission,
                founder: publicStore.founder ? { ...initial.founder, ...publicStore.founder } : initial.founder,
                contact: publicStore.contact ? { ...initial.contact, ...publicStore.contact } : initial.contact,
              };
              setData(merged);
              saveStoreToStorage(merged);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('[DataContext] Error fetching data from Firestore:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFirestoreData();

    return () => {
      isMounted = false;
      window.removeEventListener('refetch-data', handleRefetch);
    };
  }, [isAdmin]);

  // Counts Calculation
  const counts = useMemo(() => {
    const vCount = data.vichar.length;
    const vidCount = data.videos.length;
    const aCount = data.audio.length;
    const pCount = data.photos.length;
    const dCount = data.documents.length;
    const nCount = data.notices.length;
    const lCount = data.links.length;

    const allItems = [
      ...data.vichar,
      ...data.videos,
      ...data.audio,
      ...data.photos,
      ...data.documents,
      ...data.notices,
    ];

    const published = allItems.filter((i) => i.status === 'published').length;
    const draft = allItems.filter((i) => i.status === 'draft').length;

    return {
      vichar: vCount,
      videos: vidCount,
      audio: aCount,
      photos: pCount,
      documents: dCount,
      notices: nCount,
      links: lCount,
      total: allItems.length,
      published,
      draft,
    };
  }, [data]);

  /* ---------------- VICHAR ---------------- */
  const addVichar = useCallback(async (item: Partial<VicharItem>): Promise<VicharItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: VicharItem = {
      id: item.id || generateUniqueId('vichar'),
      type: 'vichar',
      typeLabel: '📝 संदेश',
      title: item.title || 'शीर्षक रहित विचार',
      date: item.date || getFormattedCurrentDate(),
      author: item.author || 'अहिंसा शिक्षा मिशन',
      topic: item.topic || 'अहिंसा',
      source: item.source || '',
      leadParagraph: item.leadParagraph || '',
      paragraphs: item.paragraphs || [],
      keyTakeaway: item.keyTakeaway || '',
      imageUrl: item.imageUrl,
      status,
      language: item.language || 'hi',
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      vichar: [newItem, ...prev.vichar.filter((v) => v.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updateVichar = useCallback(async (id: string, updates: Partial<VicharItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.vichar.find((item) => item.id === id);
    if (!current) {
      throw new Error("विचार नहीं मिला");
    }

    const nextStatus = updates.status || current.status;
    const merged: VicharItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      vichar: prev.vichar.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.vichar]);

  const deleteVichar = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      vichar: prev.vichar.filter((item) => item.id !== id),
    }));
  }, []);

  const getVicharById = useCallback((id: string) => {
    return data.vichar.find((item) => item.id === id);
  }, [data.vichar]);

  /* ---------------- VIDEO ---------------- */
  const addVideo = useCallback(async (item: Partial<VideoItem>): Promise<VideoItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: VideoItem = {
      id: item.id || generateUniqueId('video'),
      type: 'video',
      typeLabel: '🎥 वीडियो',
      title: item.title || 'शीर्षक रहित वीडियो',
      date: item.date || getFormattedCurrentDate(),
      speaker: item.speaker || 'अहिंसा शिक्षा मिशन',
      duration: item.duration || '१०:००',
      youtubeUrl: item.youtubeUrl || '',
      youtubeVideoId: item.youtubeVideoId,
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      topics: item.topics || [],
      status,
      language: item.language || 'hi',
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      videos: [newItem, ...prev.videos.filter((v) => v.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updateVideo = useCallback(async (id: string, updates: Partial<VideoItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.videos.find((item) => item.id === id);
    if (!current) {
      throw new Error("वीडियो नहीं मिला");
    }

    const nextStatus = updates.status || current.status;
    const merged: VideoItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      videos: prev.videos.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.videos]);

  const deleteVideo = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      videos: prev.videos.filter((item) => item.id !== id),
    }));
  }, []);

  const getVideoById = useCallback((id: string) => {
    return data.videos.find((item) => item.id === id);
  }, [data.videos]);

  /* ---------------- AUDIO ---------------- */
  const addAudio = useCallback(async (item: Partial<AudioItem>): Promise<AudioItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: AudioItem = {
      id: item.id || generateUniqueId('audio'),
      type: 'audio',
      typeLabel: '🎧 ऑडियो संदेश',
      title: item.title || 'शीर्षक रहित ऑडियो',
      date: item.date || getFormattedCurrentDate(),
      speaker: item.speaker || 'अहिंसा शिक्षा मिशन',
      duration: item.duration || '०३:३०',
      currentTime: '००:००',
      description: item.description || '',
      aboutText: item.aboutText || '',
      fileName: item.fileName || 'audio_message.mp3',
      fileSize: item.fileSize || '२.५ MB',
      fileType: item.fileType || 'audio/mpeg',
      audioUrl: item.audioUrl || '',
      status,
      language: item.language || 'hi',
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      audio: [newItem, ...prev.audio.filter((a) => a.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updateAudio = useCallback(async (id: string, updates: Partial<AudioItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.audio.find((item) => item.id === id);
    if (!current) {
      throw new Error("ऑडियो नहीं मिला");
    }

    const nextStatus = updates.status || current.status;
    const merged: AudioItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      audio: prev.audio.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.audio]);

  const deleteAudio = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      audio: prev.audio.filter((item) => item.id !== id),
    }));
  }, []);

  const getAudioById = useCallback((id: string) => {
    return data.audio.find((item) => item.id === id);
  }, [data.audio]);

  /* ---------------- PHOTO ---------------- */
  const addPhoto = useCallback(async (item: Partial<PhotoItem>): Promise<PhotoItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: PhotoItem = {
      id: item.id || generateUniqueId('photo'),
      type: 'photo',
      typeLabel: '🖼️ फोटो',
      title: item.title || 'शीर्षक रहित फोटो',
      date: item.date || getFormattedCurrentDate(),
      caption: item.caption || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      imageFileId: item.imageFileId || '',
      location: item.location || 'मिशन परिसर',
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      photos: [newItem, ...prev.photos.filter((p) => p.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updatePhoto = useCallback(async (id: string, updates: Partial<PhotoItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.photos.find((item) => item.id === id);
    if (!current) {
      throw new Error("फोटो नहीं मिला");
    }

    const nextStatus = updates.status || current.status;
    const merged: PhotoItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      photos: prev.photos.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.photos]);

  const deletePhoto = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((item) => item.id !== id),
    }));
  }, []);

  const getPhotoById = useCallback((id: string) => {
    return data.photos.find((item) => item.id === id);
  }, [data.photos]);

  /* ---------------- DOCUMENT ---------------- */
  const addDocument = useCallback(async (item: Partial<DocumentItem>): Promise<DocumentItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: DocumentItem = {
      id: item.id || generateUniqueId('doc'),
      type: 'document',
      typeLabel: '📄 दस्तावेज',
      title: item.title || 'शीर्षक रहित दस्तावेज',
      date: item.date || getFormattedCurrentDate(),
      description: item.description || '',
      fileType: item.fileType || 'PDF',
      fileSize: item.fileSize || '१.५ MB',
      pages: item.pages || '१०',
      summary: item.summary || item.description || '',
      chapters: item.chapters || [],
      fileName: item.fileName || 'ahimsa_document.pdf',
      pdfUrl: item.pdfUrl || '',
      status,
      language: item.language || 'hi',
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      documents: [newItem, ...prev.documents.filter((d) => d.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updateDocument = useCallback(async (id: string, updates: Partial<DocumentItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.documents.find((item) => item.id === id);
    if (!current) {
      throw new Error("दस्तावेज नहीं मिला");
    }

    const nextStatus = updates.status || current.status;
    const merged: DocumentItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.documents]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      documents: prev.documents.filter((item) => item.id !== id),
    }));
  }, []);

  const getDocumentById = useCallback((id: string) => {
    return data.documents.find((item) => item.id === id);
  }, [data.documents]);

  /* ---------------- NOTICE ---------------- */
  const addNotice = useCallback(async (item: Partial<NoticeItem>): Promise<NoticeItem> => {
    const nowIso = new Date().toISOString();
    const status = item.status || 'published';
    const newItem: NoticeItem = {
      id: item.id || generateUniqueId('notice'),
      type: 'notice',
      typeLabel: '📢 सूचना',
      title: item.title || 'शीर्षक रहित सूचना',
      date: item.date || getFormattedCurrentDate(),
      content: item.content || '',
      variant: item.variant || 'blue',
      details: item.details || {
        eventDate: 'शीघ्र घोषित होगी',
        time: 'प्रातः १०:०० बजे',
        venue: 'मुख्य सभागार',
        subject: item.title || 'सूचना',
      },
      guidelines: item.guidelines || [],
      contactInfo: item.contactInfo || 'मिशन कार्यालय से जानकारी प्राप्त करें।',
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(status === 'published' ? { publishedAt: nowIso } : {}),
    };

    await saveContentItemToApi(newItem);

    setData((prev) => ({
      ...prev,
      notices: [newItem, ...prev.notices.filter((n) => n.id !== newItem.id)],
    }));

    return newItem;
  }, []);

  const updateNotice = useCallback(async (id: string, updates: Partial<NoticeItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.notices.find((item) => item.id === id);
    if (!current) {
      throw new Error("सूचना नहीं मिली");
    }

    const nextStatus = updates.status || current.status;
    const merged: NoticeItem = {
      ...current,
      ...updates,
      status: nextStatus,
      updatedAt: nowIso,
    };
    if (nextStatus === 'published') {
      merged.publishedAt = merged.publishedAt || nowIso;
    } else {
      delete merged.publishedAt;
    }

    await saveContentItemToApi(merged);

    setData((prev) => ({
      ...prev,
      notices: prev.notices.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.notices]);

  const deleteNotice = useCallback(async (id: string): Promise<void> => {
    await deleteContentItemFromApi(id);
    setData((prev) => ({
      ...prev,
      notices: prev.notices.filter((item) => item.id !== id),
    }));
  }, []);

  const getNoticeById = useCallback((id: string) => {
    return data.notices.find((item) => item.id === id);
  }, [data.notices]);

  /* ---------------- LINKS ---------------- */
  const addLink = useCallback(async (item: Partial<LinkItem>): Promise<LinkItem> => {
    const nowIso = new Date().toISOString();
    const newItem: LinkItem = {
      id: item.id || generateUniqueId('link'),
      title: item.title || 'नया लिंक',
      url: item.url || 'https://example.org',
      description: item.description || '',
      status: item.status || 'published',
      order: data.links.length + 1,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await saveLinkToApi(newItem);

    setData((prev) => ({
      ...prev,
      links: [...prev.links.filter((l) => l.id !== newItem.id), newItem],
    }));

    return newItem;
  }, [data.links.length]);

  const updateLink = useCallback(async (id: string, updates: Partial<LinkItem>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const current = data.links.find((item) => item.id === id);
    if (!current) {
      throw new Error("लिंक नहीं मिला");
    }

    const merged: LinkItem = { ...current, ...updates, updatedAt: nowIso };
    await saveLinkToApi(merged);

    setData((prev) => ({
      ...prev,
      links: prev.links.map((item) => (item.id === id ? merged : item)),
    }));
  }, [data.links]);

  const deleteLink = useCallback(async (id: string): Promise<void> => {
    await deleteLinkFromApi(id);
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((item) => item.id !== id),
    }));
  }, []);

  const reorderLinks = useCallback(async (orderedIds: string[]): Promise<void> => {
    const linkMap = new Map<string, LinkItem>(data.links.map((l) => [l.id, l]));
    const updatedLinks: LinkItem[] = [];

    orderedIds.forEach((id, index) => {
      const link = linkMap.get(id);
      if (link) {
        updatedLinks.push({ ...link, order: index + 1 });
      }
    });

    data.links.forEach((link) => {
      if (!orderedIds.includes(link.id)) {
        updatedLinks.push({ ...link, order: updatedLinks.length + 1 });
      }
    });

    // Save each in parallel
    await Promise.all(updatedLinks.map((l) => saveLinkToApi(l)));

    setData((prev) => ({ ...prev, links: updatedLinks }));
  }, [data.links]);

  /* ---------------- CMS PAGES ---------------- */
  const updateMission = useCallback(async (missionUpdates: Partial<MissionData>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const updatedMission = { ...data.mission, ...missionUpdates, updatedAt: nowIso };
    await saveSettingsDocToApi('mission', updatedMission);
    setData((prev) => ({ ...prev, mission: updatedMission }));
  }, [data.mission]);

  const updateFounder = useCallback(async (founderUpdates: Partial<FounderData>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const updatedFounder = { ...data.founder, ...founderUpdates, updatedAt: nowIso };
    await saveSettingsDocToApi('founder', updatedFounder);
    setData((prev) => ({ ...prev, founder: updatedFounder }));
  }, [data.founder]);

  const updateContact = useCallback(async (contactUpdates: Partial<ContactData>): Promise<void> => {
    const nowIso = new Date().toISOString();
    const updatedContact = { ...data.contact, ...contactUpdates, updatedAt: nowIso };
    await saveSettingsDocToApi('contact', updatedContact);
    setData((prev) => ({ ...prev, contact: updatedContact }));
  }, [data.contact]);

  const resetDemoData = useCallback(() => {
    const fresh = getInitialSeedData();
    setData(fresh);
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(fresh),
    }).catch((err) => console.error('[DataContext] Error resetting store in Firestore:', err));
  }, []);

  const resetToSeedData = useCallback(() => {
    const fresh = getInitialSeedData();
    setData(fresh);
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(fresh),
    }).catch((err) => console.error('[DataContext] Error resetting store in Firestore:', err));
  }, []);

  const restoreData = useCallback((newData: AppStoreData) => {
    setData(newData);
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    }).catch((err) => console.error('[DataContext] Error restoring store to Firestore:', err));
  }, []);

  /* ---------------- PUBLIC QUERY HELPERS ---------------- */
  const getPublishedVichar = useCallback(() => {
    return data.vichar.filter((item) => item.status === 'published');
  }, [data.vichar]);

  const getPublishedVideos = useCallback(() => {
    return data.videos.filter((item) => item.status === 'published');
  }, [data.videos]);

  const getPublishedAudio = useCallback(() => {
    return data.audio.filter((item) => item.status === 'published');
  }, [data.audio]);

  const getPublishedPhotos = useCallback(() => {
    return data.photos.filter((item) => item.status === 'published');
  }, [data.photos]);

  const getPublishedDocuments = useCallback(() => {
    return data.documents.filter((item) => item.status === 'published');
  }, [data.documents]);

  const getPublishedNotices = useCallback(() => {
    return data.notices.filter((item) => item.status === 'published');
  }, [data.notices]);

  const getPublishedLinks = useCallback(() => {
    return data.links
      .filter((item) => item.status === 'published')
      .sort((a, b) => a.order - b.order);
  }, [data.links]);

  const searchPublishedContent = useCallback((query: string): PublicSearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: PublicSearchResult[] = [];

    // 1. Vichar
    data.vichar
      .filter((v) => v.status === 'published')
      .forEach((v) => {
        if (
          v.title.toLowerCase().includes(q) ||
          v.leadParagraph.toLowerCase().includes(q) ||
          v.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
          v.author.toLowerCase().includes(q) ||
          (v.topic && v.topic.toLowerCase().includes(q))
        ) {
          results.push({
            id: v.id,
            type: 'vichar',
            typeLabel: '📝 विचार',
            title: v.title,
            excerpt: v.leadParagraph || v.paragraphs[0] || '',
            date: v.date,
            route: `/vichar/${v.id}`,
          });
        }
      });

    // 2. Videos
    data.videos
      .filter((v) => v.status === 'published')
      .forEach((v) => {
        if (
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.speaker.toLowerCase().includes(q) ||
          (v.topics && v.topics.some((t) => t.toLowerCase().includes(q)))
        ) {
          results.push({
            id: v.id,
            type: 'video',
            typeLabel: '🎥 वीडियो',
            title: v.title,
            excerpt: v.description,
            date: v.date,
            route: `/video/${v.id}`,
          });
        }
      });

    // 3. Audio
    data.audio
      .filter((a) => a.status === 'published')
      .forEach((a) => {
        if (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.speaker.toLowerCase().includes(q) ||
          a.aboutText.toLowerCase().includes(q)
        ) {
          results.push({
            id: a.id,
            type: 'audio',
            typeLabel: '🎧 ऑडियो',
            title: a.title,
            excerpt: a.description || a.aboutText,
            date: a.date,
            route: `/audio/${a.id}`,
          });
        }
      });

    // 4. Photos
    data.photos
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        if (
          p.title.toLowerCase().includes(q) ||
          p.caption.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q))
        ) {
          results.push({
            id: p.id,
            type: 'photo',
            typeLabel: '🖼️ फोटो',
            title: p.title,
            excerpt: p.caption || p.description,
            date: p.date,
            route: `/photo/${p.id}`,
          });
        }
      });

    // 5. Documents
    data.documents
      .filter((d) => d.status === 'published')
      .forEach((d) => {
        if (
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          (d.chapters && d.chapters.some((c) => c.toLowerCase().includes(q)))
        ) {
          results.push({
            id: d.id,
            type: 'document',
            typeLabel: '📄 दस्तावेज',
            title: d.title,
            excerpt: d.summary || d.description,
            date: d.date,
            route: `/document/${d.id}`,
          });
        }
      });

    // 6. Notices
    data.notices
      .filter((n) => n.status === 'published')
      .forEach((n) => {
        if (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.details && (n.details.venue.toLowerCase().includes(q) || n.details.subject.toLowerCase().includes(q)))
        ) {
          results.push({
            id: n.id,
            type: 'notice',
            typeLabel: '📢 सूचना',
            title: n.title,
            excerpt: n.content,
            date: n.date,
            route: `/notice/${n.id}`,
          });
        }
      });

    return results;
  }, [data]);

  /* ---------------- RECENT ADMIN CONTENT ---------------- */
  const getRecentAdminContent = useCallback((limit: number = 8): RecentAdminItem[] => {
    const list: RecentAdminItem[] = [];

    data.vichar.forEach((v) => {
      list.push({
        id: v.id,
        type: 'vichar',
        typeLabel: 'Vichar',
        title: v.title,
        date: v.date,
        status: v.status,
        updatedAt: v.updatedAt || v.createdAt,
        adminEditPath: `/admin/vichar/${v.id}/edit`,
        publicViewPath: `/vichar/${v.id}`,
      });
    });

    data.videos.forEach((v) => {
      list.push({
        id: v.id,
        type: 'video',
        typeLabel: 'Video',
        title: v.title,
        date: v.date,
        status: v.status,
        updatedAt: v.updatedAt || v.createdAt,
        adminEditPath: `/admin/video/${v.id}/edit`,
        publicViewPath: `/video/${v.id}`,
      });
    });

    data.audio.forEach((a) => {
      list.push({
        id: a.id,
        type: 'audio',
        typeLabel: 'Audio',
        title: a.title,
        date: a.date,
        status: a.status,
        updatedAt: a.updatedAt || a.createdAt,
        adminEditPath: `/admin/audio/${a.id}/edit`,
        publicViewPath: `/audio/${a.id}`,
      });
    });

    data.photos.forEach((p) => {
      list.push({
        id: p.id,
        type: 'photo',
        typeLabel: 'Photo',
        title: p.title,
        date: p.date,
        status: p.status,
        updatedAt: p.updatedAt || p.createdAt,
        adminEditPath: `/admin/photo/${p.id}/edit`,
        publicViewPath: `/photo/${p.id}`,
      });
    });

    data.documents.forEach((d) => {
      list.push({
        id: d.id,
        type: 'document',
        typeLabel: 'Document',
        title: d.title,
        date: d.date,
        status: d.status,
        updatedAt: d.updatedAt || d.createdAt,
        adminEditPath: `/admin/document/${d.id}/edit`,
        publicViewPath: `/document/${d.id}`,
      });
    });

    data.notices.forEach((n) => {
      list.push({
        id: n.id,
        type: 'notice',
        typeLabel: 'Notice',
        title: n.title,
        date: n.date,
        status: n.status,
        updatedAt: n.updatedAt || n.createdAt,
        adminEditPath: `/admin/notice/${n.id}/edit`,
        publicViewPath: `/notice/${n.id}`,
      });
    });

    // Sort newest updated/created first
    return list
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        counts,
        addVichar,
        updateVichar,
        deleteVichar,
        getVicharById,
        addVideo,
        updateVideo,
        deleteVideo,
        getVideoById,
        addAudio,
        updateAudio,
        deleteAudio,
        getAudioById,
        addPhoto,
        updatePhoto,
        deletePhoto,
        getPhotoById,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentById,
        addNotice,
        updateNotice,
        deleteNotice,
        getNoticeById,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        updateMission,
        updateFounder,
        updateContact,
        resetDemoData,
        resetToSeedData,
        restoreData,
        getPublishedVichar,
        getPublishedVideos,
        getPublishedAudio,
        getPublishedPhotos,
        getPublishedDocuments,
        getPublishedNotices,
        getPublishedLinks,
        searchPublishedContent,
        getRecentAdminContent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
