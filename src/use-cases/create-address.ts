import { AddressesRepository } from '@/repositories/addresses-repository'
import { Address, Prisma } from '@prisma/client'
interface CreateAddressUseCaseRequest {
  street: string
  city: string
  state: string
  postalCode: string
  user_id?: string | null
  store_id?: string | null
  //created_at: Date
}
interface CreateAddressUseCaseResponse {
  address: Address
}
export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}
  async execute({
    street,
    city,
    state,
    postalCode,
    user_id,
    store_id,
  }: // created_at,
  CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = await this.addressesRepository.create({
      street,
      city,
      state,
      postalCode,
      user_id,
      store_id,
      //  created_at,
    })
    return { address }
  }
}
