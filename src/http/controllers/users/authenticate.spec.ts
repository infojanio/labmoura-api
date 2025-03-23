import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    // Criando um usuário para teste
    const registerResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        phone: '6299775614',
        role: 'USER',
        avatar: 'perfil.png',
        address: {
          city: 'Campos Belos',
          state: 'Goiás',
          postalCode: '73840-000',
          street: 'Rua 5, qd. 6, lt. 1',
          user_id: 'userId-01',
        },
      })
    console.log('🟢 Register Response:', registerResponse.body) // 🔹 Debug do usuário criado
    expect(registerResponse.statusCode).toEqual(201)

    // Autenticando o usuário
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })
    console.log('🟡 Auth Response:', authResponse.body) // 🔹 Debug da autenticação

    expect(authResponse.statusCode).toEqual(200)
    expect(authResponse.body).toHaveProperty('accessToken')
    expect(authResponse.body).toHaveProperty('refreshToken')

    // Pegando o refreshToken do corpo da resposta
    const { refreshToken } = authResponse.body

    if (!refreshToken) {
      throw new Error('❌ Erro: Refresh token não retornado na autenticação!')
    }
    console.log('🔵 Enviando Refresh Token:', refreshToken) // 🔹 Debug do refreshToken antes da requisição

    // Faz a requisição de refresh token enviando pelo corpo da requisição
    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .send({ refreshToken })

    console.log('🔴 Refresh Token Response:', refreshResponse.body) // 🔹 Debug da resposta

    expect(refreshResponse.statusCode).toEqual(200)
    expect(refreshResponse.body).toHaveProperty('accessToken') // O novo token deve ser retornado
  })
})
