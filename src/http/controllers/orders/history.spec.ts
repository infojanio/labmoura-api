import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
describe('Order History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to list the history of orders', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow() //busca o 1 user cadastrado no banco
    const store = await prisma.store.create({
      data: {
        name: 'JavaScript Gym',
        slug: 'slogan.jpg',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    await prisma.order.createMany({
      data: [
        {
          store_id: store.id,
          user_id: user.id,
          totalAmount: 0,
          status: 'VALIDATED',
        },
        {
          store_id: store.id,
          user_id: user.id,
          totalAmount: 0,
          status: 'VALIDATED',
        },
      ],
    })
    const response = await request(app.server)
      .get('/orders/history')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.orders).toEqual([
      expect.objectContaining({
        store_id: store.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        store_id: store.id,
        user_id: user.id,
      }),
    ])
  })
})
