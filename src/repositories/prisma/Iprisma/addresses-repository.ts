import { Address, Prisma, User } from '@prisma/client'

export interface AddressesRepository {
  findById(addressId: string): Promise<Address | null>
  findByUserId(user_id: string): Promise<Address | null>
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
  update(
    addressId: string,
    data: Prisma.AddressUncheckedUpdateInput,
  ): Promise<Address>
}
