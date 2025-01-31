import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase //registerUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('Deve ser possível cadastrar o usuário com sucesso.', async () => {
    const { user } = await sut.execute({
      //   id: '254235fdffd245df',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',

      role: 'USER',
      //  created_at: new Date(),
    })

    expect(user.id).toEqual(expect.any(String)) //retorna qualquer id do tipo string
  })

  it('Deve criar o hash da senha no registro do usuário.', async () => {
    const { user } = await sut.execute({
      //  id: '254235fdffd245df',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',

      role: 'USER',
      //   created_at: new Date(),
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Não deve ser possível cadastrar usuário com mesmo email.', async () => {
    const email = 'contato@iaki.com.br'

    await sut.execute({
      //   id: '254235fdffd245df',
      name: 'John Doe',
      email,
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',
      role: 'USER',
      //   created_at: new Date(),
    })

    //sempre usar o await quando o retorno for .rejects.toBeInstaceOf
    await expect(() =>
      sut.execute({
        //    id: '254235fdffd245df',
        name: 'John Doe',
        email,
        password: '123456',
        phone: '6296695513',
        avatar: 'foto.jpg',
        role: 'USER',
        //    created_at: new Date(),
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError) //rejeita e retorna erro
  })
})
