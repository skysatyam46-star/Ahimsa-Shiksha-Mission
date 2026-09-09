import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { MobileShell, NavTabId } from './components';
import { Logo } from './components/brand/Logo';
import { AppProvider, useApp } from './context/AppContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { HomeScreen } from './screens/HomeScreen';
import { VicharScreen } from './screens/VicharScreen';
import { VideoScreen } from './screens/VideoScreen';
import { SamagriScreen } from './screens/SamagriScreen';
import { KhojScreen } from './screens/KhojScreen';

import { AudioListScreen } from './screens/AudioListScreen';
import { PhotoListScreen } from './screens/PhotoListScreen';
import { DocumentListScreen } from './screens/DocumentListScreen';
import { NoticeListScreen } from './screens/NoticeListScreen';

import { MessageDetailScreen } from './screens/MessageDetailScreen';
import { VideoDetailScreen } from './screens/VideoDetailScreen';
import { AudioDetailScreen } from './screens/AudioDetailScreen';
import { PhotoDetailScreen } from './screens/PhotoDetailScreen';
import { DocumentDetailScreen } from './screens/DocumentDetailScreen';
import { NoticeDetailScreen } from './screens/NoticeDetailScreen';

import { SettingsScreen } from './screens/SettingsScreen';
import { MissionScreen } from './screens/MissionScreen';
import { FounderScreen } from './screens/FounderScreen';
import { ContactScreen } from './screens/ContactScreen';
import { LinksScreen } from './screens/LinksScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

// Admin CMS Screens
import { AdminVicharScreen } from './screens/admin/AdminVicharScreen';
import { AdminVicharFormScreen } from './screens/admin/AdminVicharFormScreen';
import { AdminVideoScreen } from './screens/admin/AdminVideoScreen';
import { AdminVideoFormScreen } from './screens/admin/AdminVideoFormScreen';
import { AdminAudioScreen } from './screens/admin/AdminAudioScreen';
import { AdminAudioFormScreen } from './screens/admin/AdminAudioFormScreen';
import { AdminPhotoScreen } from './screens/admin/AdminPhotoScreen';
import { AdminPhotoFormScreen } from './screens/admin/AdminPhotoFormScreen';
import { AdminDocumentScreen } from './screens/admin/AdminDocumentScreen';
import { AdminDocumentFormScreen } from './screens/admin/AdminDocumentFormScreen';
import { AdminNoticeScreen } from './screens/admin/AdminNoticeScreen';
import { AdminNoticeFormScreen } from './screens/admin/AdminNoticeFormScreen';
import { AdminLinksScreen } from './screens/admin/AdminLinksScreen';
import { AdminMissionScreen } from './screens/admin/AdminMissionScreen';
import { AdminFounderScreen } from './screens/admin/AdminFounderScreen';
import { AdminContactScreen } from './screens/admin/AdminContactScreen';
import { AdminSettingsScreen } from './screens/admin/AdminSettingsScreen';
import { AdminLikesScreen } from './screens/admin/AdminLikesScreen';

export type AppRoute =
  | { screen: 'home' }
  | { screen: 'vichar' }
  | { screen: 'video' }
  | { screen: 'samagri' }
  | { screen: 'khoj' }
  | { screen: 'audio' }
  | { screen: 'photo' }
  | { screen: 'document' }
  | { screen: 'notice' }
  | { screen: 'settings' }
  | { screen: 'mission' }
  | { screen: 'founder' }
  | { screen: 'contact' }
  | { screen: 'links' }
  | { screen: 'admin-login' }
  | { screen: 'admin' }
  | { screen: 'admin-vichar' }
  | { screen: 'admin-vichar-new' }
  | { screen: 'admin-vichar-edit'; id: string }
  | { screen: 'admin-video' }
  | { screen: 'admin-video-new' }
  | { screen: 'admin-video-edit'; id: string }
  | { screen: 'admin-audio' }
  | { screen: 'admin-audio-new' }
  | { screen: 'admin-audio-edit'; id: string }
  | { screen: 'admin-photo' }
  | { screen: 'admin-photo-new' }
  | { screen: 'admin-photo-edit'; id: string }
  | { screen: 'admin-document' }
  | { screen: 'admin-document-new' }
  | { screen: 'admin-document-edit'; id: string }
  | { screen: 'admin-notice' }
  | { screen: 'admin-notice-new' }
  | { screen: 'admin-notice-edit'; id: string }
  | { screen: 'admin-links' }
  | { screen: 'admin-mission' }
  | { screen: 'admin-founder' }
  | { screen: 'admin-contact' }
  | { screen: 'admin-settings' }
  | { screen: 'admin-likes' }
  | { screen: 'vichar-detail'; id: string }
  | { screen: 'video-detail'; id: string }
  | { screen: 'audio-detail'; id: string }
  | { screen: 'photo-detail'; id: string }
  | { screen: 'document-detail'; id: string }
  | { screen: 'notice-detail'; id: string };

const parsePath = (path: string): AppRoute => {
  const clean = path.replace(/\/$/, '') || '/';

  // Admin routes
  if (clean === '/admin/login') return { screen: 'admin-login' };
  if (clean === '/admin') return { screen: 'admin' };

  // Admin Vichar
  if (clean === '/admin/vichar/new') return { screen: 'admin-vichar-new' };
  const mAdmVicEdit = clean.match(/^\/admin\/vichar\/([^/]+)\/edit$/);
  if (mAdmVicEdit) return { screen: 'admin-vichar-edit', id: mAdmVicEdit[1] };
  if (clean === '/admin/vichar') return { screen: 'admin-vichar' };

  // Admin Video
  if (clean === '/admin/video/new') return { screen: 'admin-video-new' };
  const mAdmVidEdit = clean.match(/^\/admin\/video\/([^/]+)\/edit$/);
  if (mAdmVidEdit) return { screen: 'admin-video-edit', id: mAdmVidEdit[1] };
  if (clean === '/admin/video') return { screen: 'admin-video' };

  // Admin Audio
  if (clean === '/admin/audio/new') return { screen: 'admin-audio-new' };
  const mAdmAudEdit = clean.match(/^\/admin\/audio\/([^/]+)\/edit$/);
  if (mAdmAudEdit) return { screen: 'admin-audio-edit', id: mAdmAudEdit[1] };
  if (clean === '/admin/audio') return { screen: 'admin-audio' };

  // Admin Photo
  if (clean === '/admin/photo/new') return { screen: 'admin-photo-new' };
  const mAdmPhoEdit = clean.match(/^\/admin\/photo\/([^/]+)\/edit$/);
  if (mAdmPhoEdit) return { screen: 'admin-photo-edit', id: mAdmPhoEdit[1] };
  if (clean === '/admin/photo') return { screen: 'admin-photo' };

  // Admin Document
  if (clean === '/admin/document/new') return { screen: 'admin-document-new' };
  const mAdmDocEdit = clean.match(/^\/admin\/document\/([^/]+)\/edit$/);
  if (mAdmDocEdit) return { screen: 'admin-document-edit', id: mAdmDocEdit[1] };
  if (clean === '/admin/document') return { screen: 'admin-document' };

  // Admin Notice
  if (clean === '/admin/notice/new') return { screen: 'admin-notice-new' };
  const mAdmNotEdit = clean.match(/^\/admin\/notice\/([^/]+)\/edit$/);
  if (mAdmNotEdit) return { screen: 'admin-notice-edit', id: mAdmNotEdit[1] };
  if (clean === '/admin/notice') return { screen: 'admin-notice' };

  // Admin Website Settings
  if (clean === '/admin/likes') return { screen: 'admin-likes' };
  if (clean === '/admin/links') return { screen: 'admin-links' };
  if (clean === '/admin/mission') return { screen: 'admin-mission' };
  if (clean === '/admin/founder') return { screen: 'admin-founder' };
  if (clean === '/admin/contact') return { screen: 'admin-contact' };
  if (clean === '/admin/settings') return { screen: 'admin-settings' };

  // Public Detail Routes
  const mMsg = clean.match(/^\/vichar\/([^/]+)$/);
  if (mMsg) return { screen: 'vichar-detail', id: mMsg[1] };

  const mVid = clean.match(/^\/video\/([^/]+)$/);
  if (mVid) return { screen: 'video-detail', id: mVid[1] };

  const mAud = clean.match(/^\/audio\/([^/]+)$/);
  if (mAud) return { screen: 'audio-detail', id: mAud[1] };

  const mPho = clean.match(/^\/photo\/([^/]+)$/);
  if (mPho) return { screen: 'photo-detail', id: mPho[1] };

  const mDoc = clean.match(/^\/document\/([^/]+)$/);
  if (mDoc) return { screen: 'document-detail', id: mDoc[1] };

  const mNot = clean.match(/^\/notice\/([^/]+)$/);
  if (mNot) return { screen: 'notice-detail', id: mNot[1] };

  // Public Static and List Routes
  if (clean === '/settings') return { screen: 'settings' };
  if (clean === '/mission') return { screen: 'mission' };
  if (clean === '/founder') return { screen: 'founder' };
  if (clean === '/contact') return { screen: 'contact' };
  if (clean === '/links') return { screen: 'links' };

  if (clean === '/audio') return { screen: 'audio' };
  if (clean === '/photo') return { screen: 'photo' };
  if (clean === '/document') return { screen: 'document' };
  if (clean === '/notice') return { screen: 'notice' };

  if (clean === '/vichar') return { screen: 'vichar' };
  if (clean === '/video') return { screen: 'video' };
  if (clean === '/samagri') return { screen: 'samagri' };
  if (clean === '/khoj') return { screen: 'khoj' };

  return { screen: 'home' };
};

const routeToTab = (route: AppRoute): NavTabId | null => {
  switch (route.screen) {
    case 'home':
      return 'home';
    case 'vichar':
    case 'vichar-detail':
      return 'vichar';
    case 'video':
    case 'video-detail':
      return 'video';
    case 'samagri':
    case 'audio':
    case 'photo':
    case 'document':
    case 'notice':
    case 'audio-detail':
    case 'photo-detail':
    case 'document-detail':
    case 'notice-detail':
      return 'samagri';
    case 'khoj':
      return 'khoj';
    default:
      return null;
  }
};

const tabToPath: Record<NavTabId, string> = {
  home: '/',
  vichar: '/vichar',
  video: '/video',
  samagri: '/samagri',
  khoj: '/khoj',
};

const getHeaderMeta = (route: AppRoute, t: ReturnType<typeof useApp>['t']): { title: string; subtitle?: string } => {
  switch (route.screen) {
    case 'home':
    case 'vichar':
    case 'video':
    case 'samagri':
    case 'khoj':
      return { title: t.brandTitle };
    case 'settings':
      return { title: t.settingsHeaderTitle, subtitle: t.brandTitle };
    case 'mission':
      return { title: t.missionHeading, subtitle: t.brandTitle };
    case 'founder':
      return { title: t.founderHeading, subtitle: t.brandTitle };
    case 'contact':
      return { title: t.contactHeading, subtitle: t.brandTitle };
    case 'links':
      return { title: t.linksHeading, subtitle: t.brandTitle };
    case 'audio':
      return { title: 'ऑडियो संदेश', subtitle: t.brandTitle };
    case 'photo':
      return { title: 'फोटो', subtitle: t.brandTitle };
    case 'document':
      return { title: 'दस्तावेज', subtitle: t.brandTitle };
    case 'notice':
      return { title: 'सूचनाएँ', subtitle: t.brandTitle };
    case 'vichar-detail':
      return { title: 'विचार एवं संदेश', subtitle: t.brandTitle };
    case 'video-detail':
      return { title: 'वीडियो दर्शन', subtitle: t.brandTitle };
    case 'audio-detail':
      return { title: 'ऑडियो संदेश', subtitle: 'शांति एवं सद्भाव वाणी' };
    case 'photo-detail':
      return { title: 'फोटो गैलरी', subtitle: 'मिशन की पावन झलक' };
    case 'document-detail':
      return { title: 'दस्तावेज', subtitle: 'अध्ययन एवं विचार सामग्री' };
    case 'notice-detail':
      return { title: 'सूचना', subtitle: 'कार्यक्रम व आवश्यक जानकारी' };
    default:
      return { title: t.brandTitle };
  }
};

function AppContent() {
  const [route, setRoute] = useState<AppRoute>({ screen: 'home' });
  const { t, language } = useApp();
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const { loading: dataLoading } = useData();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      const initialRoute = parsePath(window.location.pathname);
      setRoute(initialRoute);

      const handlePopState = () => {
        setRoute(parsePath(window.location.pathname));
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [route]);

  const navigateTo = useCallback((path: string) => {
    const newRoute = parsePath(path);
    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('/');
    }
  }, [navigateTo]);

  const handleAdminLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigateTo('/admin/login');
  }, [logout, navigateTo]);

  const handleTabChange = (tab: NavTabId, path: string) => {
    navigateTo(path || tabToPath[tab]);
  };

  const handleNavigateToTab = (tabId: NavTabId) => {
    navigateTo(tabToPath[tabId]);
  };

  const isAdminRoute = route.screen.startsWith('admin');

  // Unified loading screen for initial fast authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE6] sm:py-6 flex justify-center items-start">
        <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-[#FAF8F5] text-[#1F2421] relative flex flex-col justify-center items-center p-6 sm:rounded-[32px] sm:shadow-[0_12px_40px_rgba(22,50,92,0.08)] sm:border sm:border-[#E8E5DF]">
          <div className="flex flex-col items-center gap-3">
            <Logo size={56} className="animate-pulse" />
            <div className="flex items-center gap-2 text-[#16325C] font-semibold text-[14px] mt-2">
              <Loader2 size={18} className="animate-spin text-[#16325C]" />
              <span>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Admin login screen
  if (route.screen === 'admin-login') {
    if (isAdmin) {
      return (
        <AdminDashboardScreen
          onNavigate={navigateTo}
          onLogout={handleAdminLogout}
        />
      );
    }

    return (
      <AdminLoginScreen
        onLoginSuccess={() => navigateTo('/admin')}
        onBack={() => navigateTo('/settings')}
        onNavigate={navigateTo}
      />
    );
  }

  // Guard all other /admin/* routes: must be authenticated as admin
  if (isAdminRoute && !isAdmin) {
    return (
      <AdminLoginScreen
        onLoginSuccess={() => navigateTo('/admin')}
        onBack={() => navigateTo('/settings')}
        onNavigate={navigateTo}
      />
    );
  }

  if (route.screen === 'admin') {
    return (
      <AdminDashboardScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Admin Content Management Screens
  if (route.screen === 'admin-vichar') {
    return (
      <AdminVicharScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-vichar-new') {
    return (
      <AdminVicharFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-vichar-edit') {
    return (
      <AdminVicharFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-video') {
    return (
      <AdminVideoScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-video-new') {
    return (
      <AdminVideoFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-video-edit') {
    return (
      <AdminVideoFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-audio') {
    return (
      <AdminAudioScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-audio-new') {
    return (
      <AdminAudioFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-audio-edit') {
    return (
      <AdminAudioFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-photo') {
    return (
      <AdminPhotoScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-photo-new') {
    return (
      <AdminPhotoFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-photo-edit') {
    return (
      <AdminPhotoFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-document') {
    return (
      <AdminDocumentScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-document-new') {
    return (
      <AdminDocumentFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-document-edit') {
    return (
      <AdminDocumentFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-notice') {
    return (
      <AdminNoticeScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-notice-new') {
    return (
      <AdminNoticeFormScreen key="new" onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-notice-edit') {
    return (
      <AdminNoticeFormScreen key={`edit-${route.id}`} id={route.id} onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-links') {
    return (
      <AdminLinksScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-mission') {
    return (
      <AdminMissionScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-founder') {
    return (
      <AdminFounderScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-contact') {
    return (
      <AdminContactScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-settings') {
    return (
      <AdminSettingsScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route.screen === 'admin-likes') {
    return (
      <AdminLikesScreen
        onNavigate={navigateTo}
        onLogout={handleAdminLogout}
      />
    );
  }

  const currentTab = routeToTab(route);
  const headerMeta = getHeaderMeta(route, t);

  return (
    <MobileShell
      currentTab={currentTab}
      onTabChange={handleTabChange}
      title={headerMeta.title}
      subtitle={headerMeta.subtitle}
      onOpenAdmin={() => navigateTo('/admin')}
      onOpenSettings={() => {
        if (route.screen === 'settings') {
          handleBack();
        } else {
          navigateTo('/settings');
        }
      }}
      isSettingsActive={route.screen === 'settings'}
    >
      {dataLoading ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 min-h-[300px]" id="app-loading-container">
          <Loader2 size={32} className="animate-spin text-[#16325C]" />
          <span className="text-sm text-[#1F2421]/60 mt-3 font-medium">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </span>
        </div>
      ) : (
        <>
          {route.screen === 'home' && (
            <HomeScreen
              onNavigateToTab={handleNavigateToTab}
              onNavigateToRoute={navigateTo}
            />
          )}

          {route.screen === 'vichar' && (
            <VicharScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'video' && (
            <VideoScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'samagri' && (
            <SamagriScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'khoj' && (
            <KhojScreen onNavigateToDetail={navigateTo} />
          )}

          {/* Content Type List Screens */}
          {route.screen === 'audio' && (
            <AudioListScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'photo' && (
            <PhotoListScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'document' && (
            <DocumentListScreen onNavigateToDetail={navigateTo} />
          )}

          {route.screen === 'notice' && (
            <NoticeListScreen onNavigateToDetail={navigateTo} />
          )}

          {/* Phase 5A Settings & Information Screens */}
          {route.screen === 'settings' && (
            <SettingsScreen
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {route.screen === 'mission' && (
            <MissionScreen
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {route.screen === 'founder' && (
            <FounderScreen
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {route.screen === 'contact' && (
            <ContactScreen
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {route.screen === 'links' && (
            <LinksScreen
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {/* Detail Screens */}
          {route.screen === 'vichar-detail' && (
            <MessageDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToMessage={(msgId) => navigateTo(`/vichar/${msgId}`)}
            />
          )}

          {route.screen === 'video-detail' && (
            <VideoDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToVideo={(vidId) => navigateTo(`/video/${vidId}`)}
            />
          )}

          {route.screen === 'audio-detail' && (
            <AudioDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToAudio={(audId) => navigateTo(`/audio/${audId}`)}
            />
          )}

          {route.screen === 'photo-detail' && (
            <PhotoDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToPhoto={(phoId) => navigateTo(`/photo/${phoId}`)}
            />
          )}

          {route.screen === 'document-detail' && (
            <DocumentDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToDocument={(docId) => navigateTo(`/document/${docId}`)}
            />
          )}

          {route.screen === 'notice-detail' && (
            <NoticeDetailScreen
              id={route.id}
              onBack={handleBack}
              onNavigateToNotice={(notId) => navigateTo(`/notice/${notId}`)}
            />
          )}
        </>
      )}
    </MobileShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AppProvider>
    </AuthProvider>
  );
}
