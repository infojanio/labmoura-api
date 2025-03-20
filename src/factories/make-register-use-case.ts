import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../use-cases/users/register'
import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const addressesRepository = new PrismaAddressesRepository()

  const registerUseCase = new RegisterUseCase(
    usersRepository,
    addressesRepository,
  )
  return registerUseCase
}
