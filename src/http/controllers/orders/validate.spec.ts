import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to validate a order', async () => {
    const { token } = await createAndAuthenticateUser(app)
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
        totalAmount: 0,
      },
    })
    const response = await request(app.server)
      .patch(`/orders/${order.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(204)
    order = await prisma.order.findUniqueOrThrow({
      where: {
        id: order.id,
      },
    })
    expect(order.validated_at).toEqual(expect.any(Date))
  })
})
