import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
describe('Validate Order (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to validate a order', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()
    const store = await prisma.store.create({
      data: {
        name: 'JavaScript Gym',
        slug: 'slogan.jpg',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    let order = await prisma.order.create({
      data: {
        store_id: store.id,
        user_id: user.id,
        totalAmount: 100,
        validated_at: null,
        status: 'PENDING',
        created_at: new Date(),
      },
    })
    const response = await request(app.server)
      .patch(`/orders/${order.id}/validate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log('🔵 Response:', response.statusCode, response.body)

    expect(response.statusCode).toEqual(204)
    order = await prisma.order.findUniqueOrThrow({
      where: {
        id: order.id,
      },
    })
    console.log('✅ Pedido atualizado:', order)

    expect(order.validated_at).toEqual(expect.any(Date))
  })
})
