import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
describe('Create Order (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a order', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)
    const store = await prisma.store.create({
      data: {
        name: 'Loja Teste',
        slug: 'loja-teste',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    const response = await request(app.server)
      .post(`/stores/${store.id}/orders`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    console.log('Response create order:', response.body)
    expect(response.statusCode).toEqual(201)
  })
})
