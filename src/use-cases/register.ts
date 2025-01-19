import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Role, User } from '@prisma/client'

interface RegisterUseCaseRequest {
  id: string
  name: string
  email: string
  password: string
  phone: string
  avatar: string
  role: Role
  created_at: Date
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    password,
    phone,
    avatar,
    role,
    created_at,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    //const prismaUsersRepository = new PrismaUsersRepository()

    const user = await this.usersRepository.create({
      id,
      name,
      email,
      passwordHash,
      phone,
      avatar,
      role,
      created_at,
    })

    return { user }
  }
}
