import { StoresRepository } from '@/repositories/stores-repository'
import { Store } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
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
  constructor(private storesRepository: StoresRepository) {}
  async execute({
    id,
    name,
    slug,
    latitude,
    longitude,
    address,
  }: CreateStoreUseCaseRequest): Promise<CreateStoreUseCaseResponse> {
    /*
 try {
         const storeWithSameName = await this.storesRepository.findByName(name)

      if (storeWithSameName) {
        throw new UserAlreadyExistsError()
      }
*/
    try {
      const store = await this.storesRepository.create({
        id,
        name,
        slug,
        latitude,
        longitude,
      })
      return {
        store,
      }
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error
      }

      throw new Error('Erro inesperado ao registrar usuário e endereço')
    }
  }
}
