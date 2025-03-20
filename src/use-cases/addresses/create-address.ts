import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'
import { Address, Prisma } from '@prisma/client'
interface CreateAddressUseCaseRequest {
  id?: string
  street: string
  city: string
  state: string
  postalCode: string
  store_id?: string | null
  user_id?: string | null
  //created_at: Date
}
interface CreateAddressUseCaseResponse {
  address: Address
}
export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}
  async execute({
    id,
    street,
    city,
    state,
    postalCode,
    store_id,
    user_id,
  }: // created_at,
  CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = await this.addressesRepository.create({
      id,
      street,
      city,
      state,
      postalCode,
      store_id,
      user_id,
      //  created_at,
    })
    return { address }
  }
}
