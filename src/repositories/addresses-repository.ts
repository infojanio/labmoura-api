import { Address, Prisma } from '@prisma/client'

export interface AddressesRepository {
  findById(addressId: string): Promise<Address | null>
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
  update(
    addressId: string,
    data: Prisma.AddressUncheckedUpdateInput,
  ): Promise<Address>
}
