import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../../utils/messages/errors/user-already-exists-error'
import { Role, User } from '@prisma/client'
import { AddressesRepository } from '@/repositories/prisma/Iprisma/addresses-repository'

interface RegisterUseCaseRequest {
  id?: string
  name: string
  email: string
  password: string
  phone: string
  avatar: string
  role: Role

  address: {
    street: string
    city: string
    state: string
    postalCode: string
  }
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    id,
    name,
    email,
    password,
    phone,
    avatar,
    role,
    address,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    try {
      const passwordHash = await hash(password, 6)

      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail) {
        throw new UserAlreadyExistsError()
      }

      // Cria o usuário
      const user = await this.usersRepository.create({
        id,
        name,
        email,
        passwordHash,
        phone,
        avatar,
        role,
      })

      // Se não existir, cria o endereço
      await this.addressesRepository.create({
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        user_id: user.id,
      })

      return { user }
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error
      }
      throw new Error('Erro inesperado ao registrar usuário e endereço')
    }
  }
}
