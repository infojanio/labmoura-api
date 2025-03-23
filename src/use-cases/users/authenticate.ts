import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { InvalidCredentialsError } from '@/utils/messages/errors/invalid-credentials-error'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

//responsável pela autenticação
export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email) //busca usuário por email
    if (!user) {
      throw new InvalidCredentialsError() //se não encontrou user, retorna mensagem de erro
    }

    const doestPasswordMatches = await compare(password, user.passwordHash)
    //se a senha não bate
    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }
    return {
      user,
    }
  }
}
