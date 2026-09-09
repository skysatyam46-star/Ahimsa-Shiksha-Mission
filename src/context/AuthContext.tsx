import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/check-session');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.isAdmin) {
          setIsAdmin(true);
          setAdminProfile({
            role: 'admin',
            active: true,
            email: 'admin@ahimsa.org',
            name: 'Ahimsa Admin',
          });
          return true;
        }
      }
    } catch (err) {
      console.error('[AuthContext] Failed to check session:', err);
    }
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
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Incorrect password');
      }

      setIsAdmin(true);
      setAdminProfile({
        role: 'admin',
        active: true,
        email: 'admin@ahimsa.org',
        name: 'Ahimsa Admin',
      });
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('[AuthContext] Logout failed on server:', err);
    }
    setIsAdmin(false);
    setAdminProfile(null);
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
