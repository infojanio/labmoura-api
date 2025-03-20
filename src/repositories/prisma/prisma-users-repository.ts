import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from './Iprisma/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class PrismaUsersRepository implements UsersRepository {
  /**
   * Cria um usuário com seus dados pessoais e endereço.
   *
   * @param data - Dados do usuário e do endereço.
   * @returns O usuário criado com os dados do endereço.
   */
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        ...data, // Inclui os dados pessoais

        address: {
          create: data.address?.create, // Relaciona o endereço
        },
      },
      include: {
        address: true, // Retorna os endereços associados ao usuário
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  //verifica se o email já existe
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async update(
    user_id: string,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: user_id },
        data,
      })
    } catch (error) {
      throw new ResourceNotFoundError()
    }
  }
}
