import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'

import { Prisma, Address, User } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryAddressesRepository implements AddressesRepository {
  public users: User[] = []
  public items: Address[] = []

  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    const address: Address = {
      id: data.id ?? randomUUID(),
      street: data.street || '',
      city: data.city || '',
      postalCode: data.postalCode || '',
      state: data.state || '',
      user_id: data.user_id || '',
      store_id: data.store_id || '',
      created_at: new Date(),
    }
    this.items.push(address)

    return address
  }

  async findById(addressId: string): Promise<Address | null> {
    return this.items.find((address) => address.id === addressId) || null
  }

  async findByUserId(user_id: string): Promise<Address | null> {
    return this.items.find((address) => address.user_id === user_id) || null
  }

  async update(addressId: string, data: Partial<Address>): Promise<Address> {
    const addressIndex = this.items.findIndex(
      (address) => address.id === addressId,
    )

    if (addressIndex === -1) {
      throw new Error('Endereço não encontrado.')
    }

    const updatedAddress = {
      ...this.items[addressIndex],
      ...data,
      updated_at: new Date(),
    }

    this.items[addressIndex] = updatedAddress
    return updatedAddress
  }
}
