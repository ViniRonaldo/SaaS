import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  healthUnitId?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; cpf: string; phone: string }) => Promise<AuthUser>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

function setAuthCookies(accessToken: string, role: string) {
  if (typeof document === 'undefined') return;

  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `filasaude-token=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `filasaude-role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === 'undefined') return;

  document.cookie = 'filasaude-token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'filasaude-role=; path=/; max-age=0; SameSite=Lax';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{
            user: AuthUser;
            accessToken: string;
            refreshToken: string;
          }>('/auth/login', { email, password });

          api.setToken(res.accessToken);
          setAuthCookies(res.accessToken, res.user.role);
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return res.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{
            user: AuthUser;
            accessToken: string;
            refreshToken: string;
          }>('/auth/register', data);

          api.setToken(res.accessToken);
          setAuthCookies(res.accessToken, res.user.role);
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return res.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        api.setToken(null);
        clearAuthCookies();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        api.setToken(accessToken);
        set({ accessToken, refreshToken });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'filasaude-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          api.setToken(state.accessToken);
          if (state.user?.role) setAuthCookies(state.accessToken, state.user.role);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
