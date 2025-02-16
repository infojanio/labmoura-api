import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Nearby Stores (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able list nearby stores', async () => {
    const { token } = await createAndAuthenticateUser(app)
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        slug: 'Some description.',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TypeScript Gym',
        slug: 'Some description.',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })
    const response = await request(app.server)
      .get('/stores/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.stores).toHaveLength(1)
    expect(response.body.stores).toEqual([
      expect.objectContaining({
        name: 'JavaScript Gym',
      }),
    ])
  })
})
