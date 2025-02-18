import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    // 2️⃣ Verifica se o login retornou status 200 e tem um cookie de refresh
    expect(authResponse.statusCode).toEqual(200)
    const cookies = authResponse.headers['set-cookie']

    expect(cookies).toBeDefined()

    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    // 4️⃣ Verifica se a resposta contém o novo token de acesso
    expect(refreshResponse.statusCode).toEqual(200)
    expect(refreshResponse.body).toHaveProperty('token')
    expect(refreshResponse.body.token).toBeDefined()
  })
})
