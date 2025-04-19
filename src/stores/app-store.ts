import { AppStore } from '@/types';
import { create } from 'zustand';

export const useAppStore = create<AppStore>((set) => ({
  tab: null,
  setTab: (tab) => set(() => ({ tab })),
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  otpCode: null,
  setOtpCode: (otpCode) => set(() => ({ otpCode })),
  data: null,
  setData: (data) => set(() => ({ data })),
}));
