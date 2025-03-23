import { Prisma, Store } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface StoresRepository {
  findById(id: string): Promise<Store | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Store[]>
  findByName(name: string): Promise<Store | null>
  create(data: Prisma.StoreCreateInput): Promise<Store>
  searchMany(search: string, page: number): Promise<Store[]> //buscar por nome
}
