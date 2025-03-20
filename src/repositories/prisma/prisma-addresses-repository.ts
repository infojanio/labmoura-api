import { prisma } from '@/lib/prisma'
import { Address, Prisma } from '@prisma/client'
import { AddressesRepository } from './Iprisma/addresses-repository'
export class PrismaAddressesRepository implements AddressesRepository {
  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    return prisma.address.create({ data })
  }

  async findById(addressId: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id: addressId } })
  }

  async findByUserId(user_id: string): Promise<Address | null> {
    const address = await prisma.address.findFirst({
      where: { user_id },
    })
    return address
  }

  async update(
    addressId: string,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address> {
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data,
    })
    return updatedAddress
  }
}
