import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserUseCase } from '../use-cases/users/update-user'
import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
export function makeUpdateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const addressesRepository = new PrismaAddressesRepository()
  const useCase = new UpdateUserUseCase(usersRepository)
  return useCase
}
