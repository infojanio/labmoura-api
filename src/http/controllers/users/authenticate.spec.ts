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
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6299775614',
      role: 'USER',
      avatar: 'perfil.png',
    })
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.headers['set-cookie'] // Captura os cookies

    //console.log('Auth Response Headers:', response.headers['set-cookie'])

    // Faz a requisição de refresh token usando o cookie
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies) // Envia os cookies armazenados
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token') // O novo token deve ser retornado
  })
})
