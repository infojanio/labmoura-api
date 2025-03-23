import { prisma } from '@/lib/prisma'
import {
  FindManyNearbyParams,
  StoresRepository,
} from '@/repositories/prisma/Iprisma/stores-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { Address, OrderItem, Prisma, Store } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryStoresRepository implements StoresRepository {
  public stores: Store[] = []
  public addresses: Address[] = []

  //busca lojas próximas até 15 km
  async findManyNearby(params: FindManyNearbyParams) {
    return this.stores.filter((item) => {
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

  async findById(id: string): Promise<Store | null> {
    const store = this.stores.find((store) => store.id === id)
    console.log('Buscando loja com ID:', id, 'Resultado:', store)
    return store ?? null
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { order_id: orderId },
    })
  }

  async searchMany(query: string, page: number) {
    return this.stores
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  //verifica se o nome já existe
  async findByName(name: string) {
    const store = await prisma.store.findFirst({
      where: {
        name,
      },
    })
    return store
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
    this.stores.push(store)

    return store
  }

  async createAddress(data: Omit<Address, 'id'>) {
    const address = {
      id: randomUUID(),
      ...data,
    }

    this.addresses.push(address)
    return address
  }
}
