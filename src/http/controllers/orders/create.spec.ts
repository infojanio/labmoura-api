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
    const { token } = await createAndAuthenticateUser(app)
    const store = await prisma.store.create({
      data: {
        name: 'JavaScript Gym',
        slug: 'slogan.jpg',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    const response = await request(app.server)
      .post(`/stores/${store.id}/orders`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    expect(response.statusCode).toEqual(201)
  })
})
