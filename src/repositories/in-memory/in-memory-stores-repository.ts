import {
  FindManyNearbyParams,
  StoresRepository,
} from '@/repositories/stores-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { Prisma, Store } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryStoresRepository implements StoresRepository {
  //busca lojas próximas até 15 km
  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      console.log(distance)
      return distance < 15
    })
  }

  public items: Store[] = []
  async findById(id: string) {
    const store = this.items.find((item) => item.id === id)
    if (!store) {
      return null
    }
    return store
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.StoreCreateInput) {
    const store = {
      id: data.id ?? randomUUID(),
      name: data.name,
      slug: data.slug ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }
    this.items.push(store)

    return store
  }
}
