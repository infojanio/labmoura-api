import { StoresRepository } from '@/repositories/prisma/Iprisma/stores-repository'
import { Store } from '@prisma/client'
interface FetchNearbyStoresUseCaseRequest {
  userLatitude: number
  userLongitude: number
}
interface FetchNearbyStoresUseCaseResponse {
  stores: Store[]
}
export class FetchNearbyStoresUseCase {
  constructor(private storesRepository: StoresRepository) {}
  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyStoresUseCaseRequest): Promise<
    FetchNearbyStoresUseCaseResponse
  > {
    const stores = await this.storesRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return {
      stores,
    }
  }
}
