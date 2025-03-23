import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'
import { UserAlreadyExistsError } from '../../utils/messages/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let addressesRepository: InMemoryAddressesRepository

let sut: RegisterUseCase //registerUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    addressesRepository = new InMemoryAddressesRepository()
    sut = new RegisterUseCase(usersRepository, addressesRepository)
  })

  it('Deve ser possível cadastrar o usuário com sucesso.', async () => {
    const { user } = await sut.execute({
      id: '9f75e18a-c61f-4dff-ae82-f07b799679b6',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',
      role: 'USER',
      address: {
        city: 'Campos Belos',
        state: 'Goiás',
        postalCode: '73840-000',
        street: 'Rua 5, qd. 6, lt. 1',
      },
    })

    expect(user.id).toEqual(expect.any(String)) //retorna qualquer id do tipo string
  })

  it('Deve criar o hash da senha no registro do usuário.', async () => {
    const { user } = await sut.execute({
      //id: '254235fdffd245df',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',
      role: 'USER',
      address: {
        city: 'Campos Belos',
        state: 'Goiás',
        postalCode: '73840-000',
        street: 'Rua 5, qd. 6, lt. 1',
      },
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Não deve ser possível cadastrar usuário com mesmo email.', async () => {
    const email = 'contato@iaki.com.br'

    await sut.execute({
      //id: '254235fdffd245df',
      name: 'John Doe',
      email,
      password: '123456',
      phone: '6296695513',
      avatar: 'foto.jpg',
      role: 'USER',
      address: {
        city: 'Campos Belos',
        state: 'Goiás',
        postalCode: '73840-000',
        street: 'Rua 5, qd. 6, lt. 1',
      },
    })

    //sempre usar o await quando o retorno for .rejects.toBeInstaceOf
    await expect(() =>
      sut.execute({
        // id: '254235fdffd245df',
        name: 'John Doe',
        email,
        password: '123456',
        phone: '6296695513',
        avatar: 'foto.jpg',
        role: 'USER',
        address: {
          city: 'Campos Belos',
          state: 'Goiás',
          postalCode: '73840-000',
          street: 'Rua 5, qd. 6, lt. 1',
        },
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError) //rejeita e retorna erro
  })
})
