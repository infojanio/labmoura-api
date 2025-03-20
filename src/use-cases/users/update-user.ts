import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'
import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { Role, User } from '@prisma/client'

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  phone?: string
  role?: Role
  avatar?: string
}

interface UpdateUserUseCaseResponse {
  updatedUser: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    ...data
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    // Verifica se o usuário existe
    const existingUser = await this.usersRepository.findById(userId)

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Atualiza os dados do usuário
    const updatedUser = await this.usersRepository.update(userId, data)

    return { updatedUser }
  }
}
