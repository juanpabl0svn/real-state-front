import { Prisma, $Enums } from '@prisma/client'

export type Property = Prisma.propertiesGetPayload<{}>

export type User = Prisma.UserGetPayload<{}>

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

export interface ICreateProperty extends Omit<Property, 'id' | 'status'> {
  mainPhoto: File[]
  photos: File[]
}

export interface IUpdateProperty extends Partial<Property> {
  mainPhoto: Array<File | string>
  photos: Array<File | string>
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
export type ReturnTypeHandler<T = any> =
  | { error: true; message: string; data?: never }
  | { error: false; data: T | any | null; message?: string }
  | null


