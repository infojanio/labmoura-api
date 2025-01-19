import { StoresRepository } from '@/repositories/stores-repository'
import { Store } from '@prisma/client'
interface SearchStoresUseCaseRequest {
  search: string
  page: number
}
interface SearchStoresUseCaseResponse {
  stores: Store[]
}
export class SearchStoresUseCase {
  constructor(private storesRepository: StoresRepository) {}
  async execute({
    search,
    page,
  }: SearchStoresUseCaseRequest): Promise<SearchStoresUseCaseResponse> {
    const stores = await this.storesRepository.searchMany(search, page)
    return {
      stores,
    }
  }
}
