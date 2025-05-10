import { Prisma, $Enums } from '@prisma/client'

export type Photos = Prisma.photosGetPayload<{}>

export type Property = Prisma.propertiesGetPayload<{}> & { photos?: Photos[] }

export type User = Prisma.UserGetPayload<{}>

export type INotification = Prisma.NotificationGetPayload<{}>

export type PropertyTypes = $Enums['PropertyType']

export type PropertyStatus = $Enums['PropertyStatus']

export type NotificationTypes = $Enums['NotificationType']

export interface FilterOptions {
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  property_type?: PropertyTypes
  city?: string
  neighborhood?: string
  status?: PropertyStatus
}
export type Notification = Omit<INotification, 'data' | 'type'> & (
  | {
    type: 'property_approved'
    data: {
      property_id: string
      property_title: string
    }
  }
  | {
    type: 'property_rejected'
    data: {
      property_id: string
      property_title: string
      reason: string
    }
  }
  | {
    type: 'consultancy_meeting_date_changed'
    data: {
      consultancy_id: string
      consultancy_name: string
      new_date: string
      last_date: string
    }
  }
  | {
    type: 'consultancy_created'
    data: {
      consultancy_id: string
      consultancy_name: string
      date: string
    }
  }
);

export interface Paginate<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface IPropertyForm extends Omit<Property, 'id' | 'status'> {
  main_photo: Array<File | string>
  photos: Array<File | string>
}

export interface AppStore {
  tab: string | null
  setTab: (tab: string | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  otpCode: string | null
  setOtpCode: (otpCode: string | null) => void
  data: any | null
  setData: (data: any | null) => void
  properties: Property[]
  setProperties: (properties: Property[]) => void
  notifications: Notification[]
  setNotifications: (notifications: Notification[] | ((prev: Notification[]) => Notification[])) => void
}
export type ReturnTypeHandler<T = any> =
  | { error: true; message: string; data?: never }
  | { error: false; data: T | any | null; message?: string }


