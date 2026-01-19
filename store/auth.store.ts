import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginApi, signupApi, verifyOtpApi } from '@/api/auth.api';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (payload: any) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  verifyOtp: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,

  login: async (payload) => {
    set({ loading: true });
    const res = await loginApi(payload);

    await SecureStore.setItemAsync('token', res.token);
    set({ user: res.user, token: res.token, loading: false });
  },

  signup: async (payload) => {
    set({ loading: true });
    await signupApi(payload);
    set({ loading: false });
  },

  verifyOtp: async (payload) => {
    set({ loading: true });
    const res = await verifyOtpApi(payload);

    await SecureStore.setItemAsync('token', res.token);
    set({ user: res.user, token: res.token, loading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null });
  },
}));
