import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'
import { Address, Prisma } from '@prisma/client'
interface UpdateAddressUseCaseRequest {
  addressId: string
  street: string
  city: string
  state: string
  postalCode: string
  user_id: string | null
  store_id: string | null
  created_at: Date
}
interface UpdateAddressUseCaseResponse {
  address: Address
}
export class UpdateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}
  async execute({
    addressId,
    street,
    city,
    state,
    postalCode,
    user_id,
    store_id,
    created_at,
  }: UpdateAddressUseCaseRequest): Promise<UpdateAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)
    if (!address) {
      throw new Error('Endereço não encontrado.')
    }
    const updatedAddress = await this.addressesRepository.update(addressId, {
      street,
      city,
      state,
      postalCode,
      user_id,
      store_id,
      created_at,
    })
    return { address: updatedAddress }
  }
}
