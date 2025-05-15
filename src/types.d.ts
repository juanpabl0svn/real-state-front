import { Prisma, $Enums } from '@prisma/client'

export type Photos = Prisma.photosGetPayload<{}>

export type Property = Prisma.propertiesGetPayload<{}> & { photos?: Photos[] }

export type User = Prisma.UserGetPayload<{}>

export type users_seller_permissions = Prisma.users_seller_permissionsGetPayload<{}>

export type Notification = Prisma.NotificationGetPayload<{}>

export type PropertyTypes = $Enums['PropertyType']

export type PropertyTypeCount = { type: PropertyTypes; count: number }

export type PropertyStatus = $Enums['PropertyStatus']

export type NotificationTypes = $Enums['NotificationType']

export type UserSellerPermissions = Prisma.users_seller_permissionsGetPayload<{}> & { user: User }

export interface FilterOptions {
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  property_type?: PropertyTypes
  city?: string
  neighborhood?: string
  status?: PropertyStatus
}

export type NotificationTypeVariants = (
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
  } | {
    type: 'permission_seller_rejected'
    data: {
      reason: string
    }
  } | {
    type: 'permission_seller_approved'
    data: {
    }
  }
);

export type Notification = Omit<INotification, 'data' | 'type'> & NotificationTypeVariants

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
  sellers: User[]
  setSellers: (sellers: User[]) => void
  notifications: Notification[]
  setNotifications: (notifications: Notification[] | ((prev: Notification[]) => Notification[])) => void
}
export type ReturnTypeHandler<T = any> =
  | { error: true; message: string; data?: never }
  | { error: false; data: T | any | null; message?: string }


export interface GetPropertiesOptions {
  includeProperties?: boolean     // trae el array completo de propiedades
  includeTotalCount?: boolean     // trae solo el número total
  includeTypeCounts?: boolean     // trae el array con conteo por cada tipo
  includeTopTypes?: boolean       // trae solo el/los tipo(s) con más propiedades
}

export interface GetPropertiesResult {
  properties?: Property[]
  totalCount?: number
  typeCounts?: PropertyTypeCount[]
  topTypes?: PropertyTypeCount[]
}