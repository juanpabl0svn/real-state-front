import { Prisma, $Enums } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Property = Prisma.propertiesGetPayload<{}>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type User = Prisma.UserGetPayload<{}>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Notification = Prisma.NotificationGetPayload<{}>

export type PropertyTypes = $Enums['PropertyType']


export type PropertyStatus = $Enums['PropertyStatus']


export interface FilterOptions {
  type?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  status?: string
}


export interface Paginate<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AppStore {
  tab: string | null
  setTab: (tab: string | null) => void
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
  otpCode: string | null
  setOtpCode: (otpCode: string | null) => void
  data: any | null
  setData: (data: any | null) => void
}


export const useAppStore = create<AppStore>((set) => ({
  tab: null,
  setTab: (tab) => set(() => ({ tab })),
  isLoading: false,
  setLoading: (isLoading) => set(() => ({ isLoading })),
  otpCode: null,
  setOtpCode: (otpCode) => set(() => ({ otpCode })),
  data: null,
  setData: (data) => set(() => ({ data })),
}));



