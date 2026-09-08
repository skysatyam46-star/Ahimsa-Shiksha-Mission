import { useState, useEffect, useCallback } from 'react';
import { MobileShell, NavTabId } from './components';
import { AppProvider, useApp } from './context/AppContext';

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
    case 'settings':
    case 'mission':
    case 'founder':
    case 'contact':
    case 'links':
    case 'admin-login':
    case 'admin':
      return null;
    default:
      return 'home';
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
    case 'admin-login':
      return { title: 'Admin Login', subtitle: t.brandTitle };
    case 'admin':
      return { title: 'Dashboard', subtitle: 'Admin Panel' };
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
  }
};

function AppContent() {
  const [route, setRoute] = useState<AppRoute>({ screen: 'home' });
  const { t } = useApp();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialRoute = parsePath(window.location.pathname);
      setRoute(initialRoute);

      const handlePopState = () => {
        setRoute(parsePath(window.location.pathname));
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const navigateTo = useCallback((path: string) => {
    const newRoute = parsePath(path);
    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('/');
    }
  }, [navigateTo]);

  const handleTabChange = (tab: NavTabId, path: string) => {
    navigateTo(path || tabToPath[tab]);
  };

  const handleNavigateToTab = (tabId: NavTabId) => {
    navigateTo(tabToPath[tabId]);
  };

  const currentTab = routeToTab(route);
  const headerMeta = getHeaderMeta(route, t);

  // Dedicated Admin screens (NO public bottom navigation)
  if (route.screen === 'admin-login') {
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
        onLogout={() => navigateTo('/admin/login')}
      />
    );
  }

  return (
    <MobileShell
      currentTab={currentTab}
      onTabChange={handleTabChange}
      title={headerMeta.title}
      subtitle={headerMeta.subtitle}
      onOpenSettings={() => {
        if (route.screen === 'settings') {
          handleBack();
        } else {
          navigateTo('/settings');
        }
      }}
      isSettingsActive={route.screen === 'settings'}
    >
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
    </MobileShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
