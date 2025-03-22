import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  update(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
}
