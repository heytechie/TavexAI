import { create } from 'zustand';
import { auth, googleProvider } from '@/utils/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import api from '@/utils/axios';

interface User {
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  avatar?: string;
  firebaseUid?: string;
}


interface AuthState {
  user: User | null;
  loading: boolean;
  sidebarOpen: boolean;
  showLogoutModal: boolean;
  popupBlocked: boolean;
  
  // Actions
  fetchCurrentUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setShowLogoutModal: (open: boolean) => void;
  setPopupBlocked: (blocked: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  sidebarOpen: true,
  showLogoutModal: false,
  popupBlocked: false,

  fetchCurrentUser: async () => {
    try {
      const redirectRes = await getRedirectResult(auth).catch(() => null);
      if (redirectRes && redirectRes.user) {
        const token = await redirectRes.user.getIdToken();
        const res = await api.post('/auth/login', { token }, { withCredentials: true });
        if (res.data) {
          set({ user: res.data, popupBlocked: false });
          return;
        }
      }

      const res = await api.get('/api/user/me');
      if (res.data && (res.data._id || res.data.userId || res.data.email)) {
        set({ user: res.data });
      } else {
        set({ user: null });
      }
    } catch (err) {
      set({ user: null });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, popupBlocked: false });
    try {
      let data;
      try {
        data = await signInWithPopup(auth, googleProvider);
      } catch (popupErr: any) {
        if (
          popupErr.code === 'auth/popup-blocked' ||
          popupErr.code === 'auth/cancelled-popup-request' ||
          popupErr.message?.includes('popup')
        ) {
          console.warn('Popup blocked by browser. Falling back to signInWithRedirect...');
          set({ popupBlocked: true });
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupErr;
      }

      if (data && data.user) {
        const token = await data.user.getIdToken();
        const res = await api.post(
          '/auth/login',
          { token },
          { withCredentials: true }
        );
        
        if (res.data) {
          set({ user: res.data, popupBlocked: false });
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.get('/auth/logout', { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, showLogoutModal: false });
    }
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setShowLogoutModal: (open: boolean) => set({ showLogoutModal: open }),
  setPopupBlocked: (blocked: boolean) => set({ popupBlocked: blocked }),
}));
