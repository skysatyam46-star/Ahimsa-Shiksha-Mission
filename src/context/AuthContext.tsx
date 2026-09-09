import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const ADMIN_TOKEN_KEY = 'ahimsa_admin_token';

export const getStoredAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setStoredAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const removeStoredAdminToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export interface AdminUserProfile {
  role: 'admin';
  active: boolean;
  email: string;
  name: string;
}

interface AuthContextType {
  user: any; // Kept for backward compatibility with existing components
  adminProfile: AdminUserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  missingConfigKeys: string[];
  login: (password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>; // Dummy for backward compatibility
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!getStoredAdminToken();
  });
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(() => {
    return getStoredAdminToken()
      ? {
          role: 'admin',
          active: true,
          email: 'admin@ahimsa.org',
          name: 'Ahimsa Admin',
        }
      : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const storedToken = getStoredAdminToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedToken) {
        headers['x-admin-token'] = storedToken;
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const response = await fetch('/api/admin/check-session', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.isAdmin) {
          if (result.token) {
            setStoredAdminToken(result.token);
          }
          setIsAdmin(true);
          setAdminProfile(
            result.profile || {
              role: 'admin',
              active: true,
              email: 'admin@ahimsa.org',
              name: 'Ahimsa Admin',
            }
          );
          return true;
        }
      }
    } catch (err) {
      console.error('[AuthContext] Failed to check session:', err);
    }

    // If server says session is invalid, clear token
    removeStoredAdminToken();
    setIsAdmin(false);
    setAdminProfile(null);
    return false;
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkSession();
      setLoading(false);
    };
    init();
  }, [checkSession]);

  const login = useCallback(async (password: string): Promise<void> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Incorrect password');
      }

      if (result.token) {
        setStoredAdminToken(result.token);
      }

      setIsAdmin(true);
      setAdminProfile(
        result.profile || {
          role: 'admin',
          active: true,
          email: 'admin@ahimsa.org',
          name: 'Ahimsa Admin',
        }
      );
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const storedToken = getStoredAdminToken();
    try {
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['x-admin-token'] = storedToken;
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch (err) {
      console.error('[AuthContext] Logout failed on server:', err);
    } finally {
      removeStoredAdminToken();
      setIsAdmin(false);
      setAdminProfile(null);
    }
  }, []);

  const refreshAdminStatus = useCallback(async (): Promise<boolean> => {
    return await checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider
      value={{
        user: isAdmin ? { email: 'admin@ahimsa.org', uid: 'admin' } : null,
        adminProfile,
        isAdmin,
        loading,
        isConfigured: true,
        missingConfigKeys: [],
        login,
        logout,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
