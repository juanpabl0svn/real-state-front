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