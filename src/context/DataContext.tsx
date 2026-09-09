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
  addVichar: (item: Partial<VicharItem>) => VicharItem;
  updateVichar: (id: string, item: Partial<VicharItem>) => void;
  deleteVichar: (id: string) => void;
  getVicharById: (id: string) => VicharItem | undefined;

  // Video CRUD
  addVideo: (item: Partial<VideoItem>) => VideoItem;
  updateVideo: (id: string, item: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  getVideoById: (id: string) => VideoItem | undefined;

  // Audio CRUD
  addAudio: (item: Partial<AudioItem>) => AudioItem;
  updateAudio: (id: string, item: Partial<AudioItem>) => void;
  deleteAudio: (id: string) => void;
  getAudioById: (id: string) => AudioItem | undefined;

  // Photo CRUD
  addPhoto: (item: Partial<PhotoItem>) => PhotoItem;
  updatePhoto: (id: string, item: Partial<PhotoItem>) => void;
  deletePhoto: (id: string) => void;
  getPhotoById: (id: string) => PhotoItem | undefined;

  // Document CRUD
  addDocument: (item: Partial<DocumentItem>) => DocumentItem;
  updateDocument: (id: string, item: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentItem | undefined;

  // Notice CRUD
  addNotice: (item: Partial<NoticeItem>) => NoticeItem;
  updateNotice: (id: string, item: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  getNoticeById: (id: string) => NoticeItem | undefined;

  // Link CRUD
  addLink: (item: Partial<LinkItem>) => LinkItem;
  updateLink: (id: string, item: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (orderedIds: string[]) => void;

  // Website Settings / CMS
  updateMission: (mission: Partial<MissionData>) => void;
  updateFounder: (founder: Partial<FounderData>) => void;
  updateContact: (contact: Partial<ContactData>) => void;
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

// Helper for API saving
const saveContentItemToApi = async (item: any) => {
  const res = await fetch('/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || 'Failed to save content item to Firestore';
    alert("Error: " + msg);
    window.dispatchEvent(new Event('refetch-data'));
    throw new Error(msg);
  }
  return await res.json();
};

const deleteContentItemFromApi = async (id: string) => {
  const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || 'Failed to delete content item from Firestore';
    alert("Error: " + msg);
    window.dispatchEvent(new Event('refetch-data'));
    throw new Error(msg);
  }
};

const saveLinkToApi = async (item: any) => {
  const res = await fetch('/api/admin/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || 'Failed to save link to Firestore';
    alert("Error: " + msg);
    window.dispatchEvent(new Event('refetch-data'));
    throw new Error(msg);
  }
};

const deleteLinkFromApi = async (id: string) => {
  const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || 'Failed to delete link from Firestore';
    alert("Error: " + msg);
    window.dispatchEvent(new Event('refetch-data'));
    throw new Error(msg);
  }
};

const saveSettingsDocToApi = async (docId: string, payload: any) => {
  const res = await fetch(`/api/admin/settings/${docId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || `Failed to save ${docId} settings to Firestore`;
    alert("Error: " + msg);
    window.dispatchEvent(new Event('refetch-data'));
    throw new Error(msg);
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AppStoreData>(() => getInitialSeedData());

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
          const res = await fetch('/api/admin/get-data');
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
  const addVichar = useCallback((item: Partial<VicharItem>): VicharItem => {
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

    setData((prev) => ({
      ...prev,
      vichar: [newItem, ...prev.vichar],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updateVichar = useCallback((id: string, updates: Partial<VicharItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: VicharItem | null = null;
      const newVichar = prev.vichar.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: VicharItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, vichar: newVichar };
    });
  }, []);

  const deleteVichar = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      vichar: prev.vichar.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getVicharById = useCallback((id: string) => {
    return data.vichar.find((item) => item.id === id);
  }, [data.vichar]);

  /* ---------------- VIDEO ---------------- */
  const addVideo = useCallback((item: Partial<VideoItem>): VideoItem => {
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

    setData((prev) => ({
      ...prev,
      videos: [newItem, ...prev.videos],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updateVideo = useCallback((id: string, updates: Partial<VideoItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: VideoItem | null = null;
      const newVideos = prev.videos.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: VideoItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, videos: newVideos };
    });
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      videos: prev.videos.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getVideoById = useCallback((id: string) => {
    return data.videos.find((item) => item.id === id);
  }, [data.videos]);

  /* ---------------- AUDIO ---------------- */
  const addAudio = useCallback((item: Partial<AudioItem>): AudioItem => {
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

    setData((prev) => ({
      ...prev,
      audio: [newItem, ...prev.audio],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updateAudio = useCallback((id: string, updates: Partial<AudioItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: AudioItem | null = null;
      const newAudio = prev.audio.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: AudioItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, audio: newAudio };
    });
  }, []);

  const deleteAudio = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      audio: prev.audio.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getAudioById = useCallback((id: string) => {
    return data.audio.find((item) => item.id === id);
  }, [data.audio]);

  /* ---------------- PHOTO ---------------- */
  const addPhoto = useCallback((item: Partial<PhotoItem>): PhotoItem => {
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

    setData((prev) => ({
      ...prev,
      photos: [newItem, ...prev.photos],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updatePhoto = useCallback((id: string, updates: Partial<PhotoItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: PhotoItem | null = null;
      const newPhotos = prev.photos.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: PhotoItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, photos: newPhotos };
    });
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getPhotoById = useCallback((id: string) => {
    return data.photos.find((item) => item.id === id);
  }, [data.photos]);

  /* ---------------- DOCUMENT ---------------- */
  const addDocument = useCallback((item: Partial<DocumentItem>): DocumentItem => {
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

    setData((prev) => ({
      ...prev,
      documents: [newItem, ...prev.documents],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<DocumentItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: DocumentItem | null = null;
      const newDocs = prev.documents.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: DocumentItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, documents: newDocs };
    });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getDocumentById = useCallback((id: string) => {
    return data.documents.find((item) => item.id === id);
  }, [data.documents]);

  /* ---------------- NOTICE ---------------- */
  const addNotice = useCallback((item: Partial<NoticeItem>): NoticeItem => {
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

    setData((prev) => ({
      ...prev,
      notices: [newItem, ...prev.notices],
    }));

    saveContentItemToApi(newItem);
    return newItem;
  }, []);

  const updateNotice = useCallback((id: string, updates: Partial<NoticeItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedItem: NoticeItem | null = null;
      const newNotices = prev.notices.map((item) => {
        if (item.id === id) {
          const nextStatus = updates.status || item.status;
          const merged: NoticeItem = {
            ...item,
            ...updates,
            status: nextStatus,
            updatedAt: nowIso,
          };
          if (nextStatus === 'published') {
            merged.publishedAt = merged.publishedAt || nowIso;
          } else {
            delete merged.publishedAt;
          }
          updatedItem = merged;
          return merged;
        }
        return item;
      });

      if (updatedItem) {
        saveContentItemToApi(updatedItem);
      }
      return { ...prev, notices: newNotices };
    });
  }, []);

  const deleteNotice = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notices: prev.notices.filter((item) => item.id !== id),
    }));
    deleteContentItemFromApi(id);
  }, []);

  const getNoticeById = useCallback((id: string) => {
    return data.notices.find((item) => item.id === id);
  }, [data.notices]);

  /* ---------------- LINKS ---------------- */
  const addLink = useCallback((item: Partial<LinkItem>): LinkItem => {
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

    setData((prev) => ({
      ...prev,
      links: [...prev.links, newItem],
    }));

    saveLinkToApi(newItem);
    return newItem;
  }, [data.links.length]);

  const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      let updatedLink: LinkItem | null = null;
      const newLinks = prev.links.map((item) => {
        if (item.id === id) {
          const merged: LinkItem = { ...item, ...updates, updatedAt: nowIso };
          updatedLink = merged;
          return merged;
        }
        return item;
      });

      if (updatedLink) {
        saveLinkToApi(updatedLink);
      }
      return { ...prev, links: newLinks };
    });
  }, []);

  const deleteLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((item) => item.id !== id),
    }));
    deleteLinkFromApi(id);
  }, []);

  const reorderLinks = useCallback((orderedIds: string[]) => {
    setData((prev) => {
      const linkMap = new Map<string, LinkItem>(prev.links.map((l) => [l.id, l]));
      const newLinks: LinkItem[] = [];
      orderedIds.forEach((id, index) => {
        const link = linkMap.get(id);
        if (link) {
          const updated = { ...(link as LinkItem), order: index + 1 };
          newLinks.push(updated);
          saveLinkToApi(updated);
        }
      });
      // Append any remaining
      prev.links.forEach((link) => {
        if (!orderedIds.includes(link.id)) {
          const updated = { ...link, order: newLinks.length + 1 };
          newLinks.push(updated);
          saveLinkToApi(updated);
        }
      });
      return { ...prev, links: newLinks };
    });
  }, []);

  /* ---------------- CMS PAGES ---------------- */
  const updateMission = useCallback((missionUpdates: Partial<MissionData>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      const updatedMission = { ...prev.mission, ...missionUpdates, updatedAt: nowIso };
      saveSettingsDocToApi('mission', updatedMission);
      return { ...prev, mission: updatedMission };
    });
  }, []);

  const updateFounder = useCallback((founderUpdates: Partial<FounderData>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      const updatedFounder = { ...prev.founder, ...founderUpdates, updatedAt: nowIso };
      saveSettingsDocToApi('founder', updatedFounder);
      return { ...prev, founder: updatedFounder };
    });
  }, []);

  const updateContact = useCallback((contactUpdates: Partial<ContactData>) => {
    const nowIso = new Date().toISOString();
    setData((prev) => {
      const updatedContact = { ...prev.contact, ...contactUpdates, updatedAt: nowIso };
      saveSettingsDocToApi('contact', updatedContact);
      return { ...prev, contact: updatedContact };
    });
  }, []);

  const resetDemoData = useCallback(() => {
    const fresh = getInitialSeedData();
    setData(fresh);
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fresh),
    }).catch((err) => console.error('[DataContext] Error resetting store in Firestore:', err));
  }, []);

  const resetToSeedData = useCallback(() => {
    const fresh = getInitialSeedData();
    setData(fresh);
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
