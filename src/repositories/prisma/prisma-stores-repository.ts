import { prisma } from '@/lib/prisma'
import { Store, Prisma } from '@prisma/client'
import {
  FindManyNearbyParams,
  StoresRepository,
} from './Iprisma/stores-repository'
export class PrismaStoresRepository implements StoresRepository {
  async findById(id: string): Promise<Store | null> {
    const store = await prisma.store.findUnique({
      where: {
        id,
      },
    })
    console.log('Resultado da busca manual:', store)
    return store
  }
  //busca lojas próximas até 15 km
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    //$queryRaw -> aceita escrever sql no código
    const stores = await prisma.$queryRaw<Store[]>` 
      SELECT * from stores
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 40 
    `
    return stores
  }
  async searchMany(search: string, page: number) {
    const stores = await prisma.store.findMany({
      where: {
        name: {
          contains: search, //verifica se contem a palavra
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return stores
  }

  //verifica se o email já existe
  async findByName(name: string) {
    const store = await prisma.store.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Torna a busca insensível a maiúsculas/minúsculas
        },
      },
    })
    return store
  }

  async create(data: Prisma.StoreCreateInput) {
    const store = await prisma.store.create({
      data: {
        ...data, // Inclui os dados pessoais

        address: {
          create: data.address?.create, // Relaciona o endereço
        },
      },
      include: {
        address: true, // Retorna os endereços associados ao usuário
      },
    })
    return store
  }
}
