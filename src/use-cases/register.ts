import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Role, User } from '@prisma/client'
import { AddressesRepository } from '@/repositories/addresses-repository'

interface AddressInput {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  userId: string
  storeId?: string
  created_at: Date
}

interface RegisterUseCaseRequest {
  id: string
  name: string
  email: string
  password: string
  phone: string
  avatar: string
  role: Role
  address?: AddressInput // Endereço opcional
  created_at: Date
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
    role = 'USER',
    address,
    created_at,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Verifica se já existe um usuário com o mesmo email
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // Hash da senha
    const passwordHash = await hash(password, 6)

    // Cria o usuário no banco de dados
    const user = await this.usersRepository.create({
      id,
      name,
      email,
      passwordHash,
      phone,
      avatar: avatar || '',
      role,
    })

    // Caso o endereço seja fornecido, cadastra o endereço associado ao usuário
    if (address) {
      await this.addressesRepository.create({
        user_id: user.id, // Usa o ID do usuário recém-criado
        ...address, // Desestrutura os campos do endereço
      })
    }

    return { user }
  }
}
