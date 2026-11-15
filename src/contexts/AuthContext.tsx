'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사용자 정보 조회 (세션 기반 GET /api/auth/me)
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 앱 최초 진입 시 로그인 상태 확인
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 로그아웃 처리 (POST /api/auth/logout)
  const logout = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setUser(null);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || '로그아웃 처리 중 오류가 발생했습니다.',
      };
    } catch {
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다. 다시 시도해 주세요.',
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
