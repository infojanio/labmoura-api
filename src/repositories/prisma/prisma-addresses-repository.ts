import { prisma } from '@/lib/prisma'
import { Address, Prisma } from '@prisma/client'
import { AddressesRepository } from '../addresses-repository'
export class PrismaAddressesRepository implements AddressesRepository {
  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    return prisma.address.create({ data })
  }

  async findById(addressId: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id: addressId } })
  }

  async update(
    addressId: string,
    data: Partial<Prisma.AddressUncheckedUpdateInput>,
  ): Promise<Address> {
    return prisma.address.update({
      where: { id: addressId },
      data,
    })
  }
}
