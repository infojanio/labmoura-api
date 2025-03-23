import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../../utils/messages/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('Verifica se o usuário consegue se autenticar.', async () => {
    //cadastro
    await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'contato@iaki.com.br',
      passwordHash: await hash('123456', 6),
      phone: '6296695513',
      avatar: 'foto.jpg',
      //address_id: '15dd21155gfg',
      role: 'USER',
      created_at: new Date(),
    })

    //logar
    const { user } = await sut.execute({
      email: 'contato@iaki.com.br',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String)) //retorna qualquer id do tipo string
  })

  it('Verifica se o usuário tentou logar com email incorreto.', async () => {
    //logar com email incorreto
    await expect(() =>
      sut.execute({
        email: 'teste@iaki.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Verifica se o usuário digitou a senha incorreta.', async () => {
    //cadastro
    await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'contato@iaki.com.br',
      passwordHash: await hash('123456', 6),
      phone: '6296695513',
      avatar: 'foto.jpg',
      // address_id: '15dd21155gfg',
      role: 'USER',
      created_at: new Date(),
    })

    //verifica se a senha está incorreta
    await expect(() =>
      sut.execute({
        email: 'teste@iaki.com.br',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
