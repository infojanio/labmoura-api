import { StoresRepository } from '@/repositories/prisma/Iprisma/stores-repository'
import { Store } from '@prisma/client'
import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'
import { UserAlreadyExistsError } from '../../utils/messages/errors/user-already-exists-error'
import { StoreAlreadyExistsError } from '../../utils/messages/errors/store-already-exists-error'

interface CreateStoreUseCaseRequest {
  id?: string
  name: string
  slug: string | null
  latitude: number
  longitude: number

  address: {
    street: string
    city: string
    state: string
    postalCode: string
  }
}

interface CreateStoreUseCaseResponse {
  store: Store
}

export class CreateStoreUseCase {
  constructor(
    private storesRepository: StoresRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    id,
    name,
    slug,
    latitude,
    longitude,
    address,
  }: CreateStoreUseCaseRequest): Promise<CreateStoreUseCaseResponse> {
    try {
      const storeWithSameName = await this.storesRepository.findByName(name)

      if (storeWithSameName) {
        throw new StoreAlreadyExistsError()
      }

      // Cria a loja
      const store = await this.storesRepository.create({
        id,
        name,
        slug,
        latitude,
        longitude,
      })

      // Após criar a loja, cadastra o endereço
      await this.addressesRepository.create({
        store_id: store.id,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
      })

      return {
        store,
      }
    } catch (error) {
      if (error instanceof StoreAlreadyExistsError) {
        throw error
      }
      console.error('Erro ao criar a loja:', error)
      throw new Error('Erro inesperado ao registrar loja e endereço')
    }
  }
}
