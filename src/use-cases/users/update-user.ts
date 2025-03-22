import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { Role, User } from '@prisma/client'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { EmailNotUpdatedError } from '../errors/email-not-updated-error'

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

    // console.log('imprime o usuário ', existingUser)
    if (!existingUser) {
      throw new UserNotFoundError()
    }

    // Impede a atualização do e-mail
    if (data.email && data.email !== existingUser.email) {
      throw new EmailNotUpdatedError()
    }

    // Atualiza os dados do usuário
    const updatedUser = await this.usersRepository.update(userId, data)

    return { updatedUser }
  }
}
