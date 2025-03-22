import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from '@/use-cases/users/update-user'
import { expect, describe, it, beforeEach } from 'vitest'
import { Prisma } from '@prisma/client'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('Deve ser possível atualizar os dados de um usuário existente.', async () => {
    // Arrange: Cria um produto inicial
    const CreatedUser = await usersRepository.create({
      id: '910f11fe-83d2-44bf-b921-b7faa4cd35e8',
      passwordHash: '2240',
      name: 'John Original',
      email: 'infojanio@gmail.com',
      phone: '0627654322',
      role: 'ADMIN',
      avatar: 'perfil.jpg',
      created_at: new Date(),
    })
    console.log('User Original', CreatedUser)
    // Act: Atualiza o usuário
    const { updatedUser } = await sut.execute({
      userId: CreatedUser.id,
      name: 'John_Atualizado',
      email: 'infojanio@gmail.com',
      phone: '0627654322',
      role: 'ADMIN',
      avatar: 'perfil.jpg',
    })
    console.log('display:', updatedUser)
    // Assert: Verifica que os dados foram atualizados

    expect(updatedUser.name).toBe('John_Atualizado')
    expect(updatedUser.phone).toBe('0627654322')
  })

  it('Deve lançar um erro ao tentar atualizar um usuário inexistente.', async () => {
    await expect(
      sut.execute({
        userId: '910f11fe-83d2-44bf-b921-b7faa4cd35ee',
        name: 'Usuário Inexistente',
      }),
    ).rejects.toThrow('User not found')
  })
})
