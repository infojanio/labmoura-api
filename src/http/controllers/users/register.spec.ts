import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201)
  })
})
