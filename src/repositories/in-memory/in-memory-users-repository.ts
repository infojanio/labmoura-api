import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'

import { Prisma, Address, User } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  // public users: User[] = []
  public items: User[] = []

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      phone: data.phone,
      role: 'ADMIN',
      avatar: data.avatar ?? null,
      created_at: new Date(),
    }
    this.items.push(user)

    return user
  }

  async findById(userId: string): Promise<User | null> {
    return this.items.find((user) => user.id === userId) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) || null
  }

  async update(userId: string, data: Partial<User>): Promise<User> {
    const userIndex = this.items.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.')
    }

    const updatedUser = {
      ...this.items[userIndex],
      ...data,
      updated_at: new Date(),
    }

    this.items[userIndex] = updatedUser
    return updatedUser
  }
}
