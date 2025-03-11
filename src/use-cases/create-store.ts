import { StoresRepository } from '@/repositories/stores-repository'
import { Store } from '@prisma/client'
interface CreateStoreUseCaseRequest {
  id?: string
  name: string
  slug: string | null
  latitude: number
  longitude: number

  //created_at: Date
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
  }: CreateStoreUseCaseRequest): Promise<CreateStoreUseCaseResponse> {
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
  }
}
